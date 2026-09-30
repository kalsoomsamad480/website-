import mongoose from 'mongoose';

export const RESERVATION_STATUSES = ['pending', 'approved', 'rejected', 'cancelled'];
export const SEAT_TYPES = ['table', 'study-desk'];

const reservationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true, trim: true, maxlength: 60 },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    // Stored as "YYYY-MM-DD" and "HH:mm" in cafe local time to avoid timezone shifts
    date: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
      index: true,
    },
    time: { type: String, required: true, match: /^\d{2}:\d{2}$/ },
    guests: { type: Number, required: true, min: 1, max: 8 },
    seatType: { type: String, enum: SEAT_TYPES, required: true },
    status: {
      type: String,
      enum: RESERVATION_STATUSES,
      default: 'pending',
      index: true,
    },
    notes: { type: String, trim: true, maxlength: 300, default: '' },
    source: { type: String, enum: ['web', 'agent'], default: 'web' },
  },
  { timestamps: true },
);

export default mongoose.model('Reservation', reservationSchema);
