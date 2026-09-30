import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    role: { type: String, trim: true, maxlength: 60, default: '' },
    message: { type: String, required: true, trim: true, maxlength: 400 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    avatar: { type: String, default: '' },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model('Testimonial', testimonialSchema);
