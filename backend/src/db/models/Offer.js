import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, required: true, trim: true, maxlength: 300 },
    discountText: { type: String, trim: true, maxlength: 30, default: '' },
    image: { type: String, default: '' },
    validTill: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model('Offer', offerSchema);
