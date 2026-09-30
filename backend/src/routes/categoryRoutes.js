import { Router } from 'express';
import * as categoryController from '../controllers/categoryController.js';
import { protect } from '../middleware/authMiddleware.js';
import authorize from '../middleware/roleMiddleware.js';
import validate from '../middleware/validateMiddleware.js';
import {
  categoryIdRule,
  createCategoryRules,
  updateCategoryRules,
} from '../validators/categoryValidator.js';

const router = Router();
const adminOnly = [protect, authorize('admin')];

router.get('/', categoryController.listCategories);
router.post('/', adminOnly, validate(createCategoryRules), categoryController.createCategory);
router.put('/:id', adminOnly, validate(updateCategoryRules), categoryController.updateCategory);
router.delete('/:id', adminOnly, validate(categoryIdRule), categoryController.deleteCategory);

export default router;
