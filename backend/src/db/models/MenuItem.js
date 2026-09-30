import mongoose from 'mongoose';

export const MENU_TAGS = ['veg', 'popular', 'new', 'strong', 'sweet', 'iced'];

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true, trim: true, maxlength: 300 },
    ingredients: { type: [String], default: [] },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: '' },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true,
    },
    tags: {
      type: [{ type: String, enum: MENU_TAGS }],
      default: [],
      index: true,
    },
    isAvailable: { type: Boolean, default: true },
    calories: { type: Number, min: 0 },
  },
  { timestamps: true },
);

export default mongoose.model('MenuItem', menuItemSchema);
