import cafeInfo from '../data/cafeInfo.js';

const pad = (value) => String(value).padStart(2, '0');
const toMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};
const fromMinutes = (total) => `${pad(Math.floor(total / 60))}:${pad(total % 60)}`;

/** Local calendar date as "YYYY-MM-DD". */
export function toDateString(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** "YYYY-MM-DD" -> local Date at midnight (no UTC shift). */
export function parseDateString(value) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/** True when the date is today or within the booking window. */
export function isBookableDate(value, now = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = parseDateString(value);
  if (toDateString(date) !== value) return false; // rejects 2026-02-31
  const today = parseDateString(toDateString(now));
  const last = new Date(today);
  last.setDate(last.getDate() + cafeInfo.reservations.maxDaysAhead);
  return date >= today && date <= last;
}

/**
 * Bookable start times for a date: every slot from opening until one hour before closing.
 * For today, slots less than 30 minutes away are dropped.
 */
export function getSlotsForDate(value, now = new Date()) {
  const date = parseDateString(value);
  const hours = cafeInfo.hours.find((entry) => entry.dayIndex === date.getDay());
  if (!hours) return [];

  const step = cafeInfo.reservations.slotMinutes;
  const slots = [];
  for (let minute = toMinutes(hours.open); minute <= toMinutes(hours.close) - 60; minute += step) {
    slots.push(fromMinutes(minute));
  }

  if (value !== toDateString(now)) return slots;
  const cutoff = now.getHours() * 60 + now.getMinutes() + 30;
  return slots.filter((slot) => toMinutes(slot) >= cutoff);
}
