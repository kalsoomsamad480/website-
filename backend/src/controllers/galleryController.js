import GalleryImage from '../db/models/GalleryImage.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const listGallery = asyncHandler(async (req, res) => {
  const filter = req.query.category ? { category: String(req.query.category) } : {};
  const images = await GalleryImage.find(filter).sort({ order: 1 }).lean();
  sendSuccess(res, { data: images });
});
