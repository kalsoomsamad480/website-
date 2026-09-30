import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 40 },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, trim: true, maxlength: 200, default: '' },
    image: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model('Category', categorySchema);
