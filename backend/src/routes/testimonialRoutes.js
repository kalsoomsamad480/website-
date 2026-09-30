import { Router } from 'express';
import * as testimonialController from '../controllers/testimonialController.js';
import { protect } from '../middleware/authMiddleware.js';
import authorize from '../middleware/roleMiddleware.js';
import validate from '../middleware/validateMiddleware.js';
import {
  createTestimonialRules,
  idRule,
  updateTestimonialRules,
} from '../validators/contentValidator.js';

const router = Router();
const adminOnly = [protect, authorize('admin')];

router.get('/', testimonialController.listTestimonials);
router.get('/all', adminOnly, testimonialController.listAllTestimonials);
router.post(
  '/',
  adminOnly,
  validate(createTestimonialRules),
  testimonialController.createTestimonial,
);
router.put(
  '/:id',
  adminOnly,
  validate(updateTestimonialRules),
  testimonialController.updateTestimonial,
);
router.delete('/:id', adminOnly, validate(idRule), testimonialController.deleteTestimonial);

export default router;
