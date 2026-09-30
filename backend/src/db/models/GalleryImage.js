import mongoose from 'mongoose';

const galleryImageSchema = new mongoose.Schema(
  {
    src: { type: String, required: true },
    alt: { type: String, required: true, trim: true, maxlength: 160 },
    category: {
      type: String,
      enum: ['coffee', 'food', 'space', 'people'],
      required: true,
    },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model('GalleryImage', galleryImageSchema);
