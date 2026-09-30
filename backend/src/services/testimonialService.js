import Testimonial from '../db/models/Testimonial.js';
import { createContentService } from './contentService.js';

export const testimonialService = createContentService(Testimonial, {
  label: 'Testimonial',
  fields: ['name', 'role', 'message', 'rating', 'avatar', 'isVisible'],
  sort: { createdAt: 1 },
});

export function listVisibleTestimonials() {
  return Testimonial.find({ isVisible: true }).sort({ createdAt: 1 }).lean();
}
