import { listVisibleTestimonials, testimonialService } from '../services/testimonialService.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const listTestimonials = asyncHandler(async (_req, res) => {
  sendSuccess(res, { data: await listVisibleTestimonials() });
});

export const listAllTestimonials = asyncHandler(async (_req, res) => {
  sendSuccess(res, { data: await testimonialService.listAll() });
});

export const createTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await testimonialService.create(req.body);
  sendSuccess(res, { statusCode: 201, message: 'Testimonial added.', data: testimonial });
});

export const updateTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await testimonialService.update(req.params.id, req.body);
  sendSuccess(res, { message: 'Testimonial updated.', data: testimonial });
});

export const deleteTestimonial = asyncHandler(async (req, res) => {
  await testimonialService.remove(req.params.id);
  sendSuccess(res, { message: 'Testimonial deleted.' });
});
