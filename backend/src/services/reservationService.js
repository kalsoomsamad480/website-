import Reservation from '../db/models/Reservation.js';
import SlotCounter, { slotKey } from '../db/models/SlotCounter.js';
import cafeInfo from '../data/cafeInfo.js';
import ApiError from '../utils/ApiError.js';
import { pick } from '../utils/helpers.js';
import { getSlotsForDate, isBookableDate, toDateString } from '../utils/timeSlots.js';

const ACTIVE = ['pending', 'approved'];
const capacityFor = (seatType) => cafeInfo.reservations.capacityPerSlot[seatType];

function invalid(field, message) {
  return ApiError.unprocessable('Please check the highlighted fields.', [{ field, message }]);
}

const slotFull = () => invalid('time', 'That slot just filled up. Please choose another time.');

/**
 * Atomically claims seats in a slot. The conditional $inc only matches while there is room,
 * so concurrent requests can never overbook. Returns false when the slot is full.
 */
async function claimSeats(slot, guests) {
  const _id = slotKey(slot);
  // Make sure the counter exists first (a lost insert race is harmless)
  try {
    await SlotCounter.updateOne({ _id }, { $setOnInsert: { booked: 0 } }, { upsert: true });
  } catch (error) {
    if (error.code !== 11000) throw error;
  }
  const result = await SlotCounter.updateOne(
    { _id, booked: { $lte: capacityFor(slot.seatType) - guests } },
    { $inc: { booked: guests } },
  );
  return result.modifiedCount === 1;
}

function releaseSeats(slot, guests) {
  return SlotCounter.updateOne(
    { _id: slotKey(slot), booked: { $gte: guests } },
    { $inc: { booked: -guests } },
  );
}

/** Rebuilds every slot counter from active reservations (run after seeding and on startup). */
export async function rebuildSlotCounters() {
  const rows = await Reservation.aggregate([
    { $match: { status: { $in: ACTIVE } } },
    {
      $group: {
        _id: { date: '$date', time: '$time', seatType: '$seatType' },
        booked: { $sum: '$guests' },
      },
    },
  ]);
  await SlotCounter.deleteMany({});
  if (rows.length) {
    await SlotCounter.insertMany(
      rows.map((row) => ({ _id: slotKey(row._id), booked: row.booked })),
    );
  }
  return rows.length;
}

function assertBookableDate(date) {
  if (!isBookableDate(date)) {
    throw invalid(
      'date',
      `Choose a date between today and ${cafeInfo.reservations.maxDaysAhead} days from now.`,
    );
  }
}

/** Date, time slot, and guest rules (capacity is enforced separately by claimSeats). */
function assertRules({ date, time, guests, seatType }) {
  assertBookableDate(date);
  if (!getSlotsForDate(date).includes(time)) {
    throw invalid('time', 'That time is not available. Please choose another slot.');
  }
  if (seatType === 'study-desk' && guests !== cafeInfo.reservations.studyDeskGuests) {
    throw invalid('guests', 'Study desks are booked for one person. Book a table for groups.');
  }
}

export async function getAvailability(date, seatType) {
  assertBookableDate(date);
  const slots = getSlotsForDate(date);
  const counters = await SlotCounter.find({
    _id: { $in: slots.map((time) => slotKey({ date, time, seatType })) },
  }).lean();
  const booked = new Map(counters.map((counter) => [counter._id, counter.booked]));
  const capacity = capacityFor(seatType);

  return slots.map((time) => {
    const remaining = Math.max(0, capacity - (booked.get(slotKey({ date, time, seatType })) || 0));
    return { time, remaining, available: remaining > 0 };
  });
}

export async function createReservation(data, user, source = 'web') {
  const fields = pick(data, [
    'name',
    'email',
    'phone',
    'date',
    'time',
    'guests',
    'seatType',
    'notes',
  ]);
  assertRules(fields);
  if (!(await claimSeats(fields, fields.guests))) throw slotFull();

  try {
    return await Reservation.create({ ...fields, source, user: user?._id });
  } catch (error) {
    await releaseSeats(fields, fields.guests);
    throw error;
  }
}

export function listMyReservations(user) {
  return Reservation.find({ user: user._id }).sort({ date: -1, time: -1 }).lean();
}

export async function cancelMyReservation(user, id) {
  const reservation = await Reservation.findOne({ _id: id, user: user._id });
  if (!reservation) throw ApiError.notFound('Reservation not found.');
  if (!ACTIVE.includes(reservation.status)) {
    throw ApiError.conflict('This reservation can no longer be cancelled.');
  }
  if (reservation.date < toDateString(new Date())) {
    throw ApiError.conflict('Past reservations cannot be cancelled.');
  }
  reservation.status = 'cancelled';
  await reservation.save();
  await releaseSeats(reservation, reservation.guests);
  return reservation.toObject();
}

export function listReservations({ status, date } = {}) {
  const filter = {};
  if (status) filter.status = status;
  if (date) filter.date = date;
  return Reservation.find(filter).sort({ date: 1, time: 1 }).lean();
}

export async function updateReservationStatus(id, status) {
  const reservation = await Reservation.findById(id);
  if (!reservation) throw ApiError.notFound('Reservation not found.');

  const wasActive = ACTIVE.includes(reservation.status);
  const willBeActive = ACTIVE.includes(status);

  // Re-activating a cancelled or declined booking must still fit the slot
  if (willBeActive && !wasActive) {
    assertRules(reservation);
    if (!(await claimSeats(reservation, reservation.guests))) throw slotFull();
  }

  reservation.status = status;
  try {
    await reservation.save();
  } catch (error) {
    if (willBeActive && !wasActive) await releaseSeats(reservation, reservation.guests);
    throw error;
  }

  if (wasActive && !willBeActive) await releaseSeats(reservation, reservation.guests);
  return reservation.toObject();
}

export async function rescheduleReservation(id, { date, time }) {
  const reservation = await Reservation.findById(id);
  if (!reservation) throw ApiError.notFound('Reservation not found.');

  const { guests, seatType } = reservation;
  const from = { date: reservation.date, time: reservation.time, seatType };
  const to = { date, time, seatType };
  assertRules({ ...to, guests });
  if (slotKey(from) === slotKey(to)) return reservation.toObject();

  const active = ACTIVE.includes(reservation.status);
  // Claim the new slot before giving up the old one, so a failure leaves the booking intact
  if (active && !(await claimSeats(to, guests))) throw slotFull();

  Object.assign(reservation, { date, time });
  try {
    await reservation.save();
  } catch (error) {
    if (active) await releaseSeats(to, guests);
    throw error;
  }

  if (active) await releaseSeats(from, guests);
  return reservation.toObject();
}
