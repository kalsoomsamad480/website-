import mongoose from 'mongoose';

// Guests booked per time slot, one document per "date|time|seatType".
// Seats are claimed with a single conditional update, so two simultaneous
// bookings can never both take the last places.
const slotCounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  booked: { type: Number, required: true, min: 0 },
});

export const slotKey = ({ date, time, seatType }) => `${date}|${time}|${seatType}`;

export default mongoose.model('SlotCounter', slotCounterSchema);
