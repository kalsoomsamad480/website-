import { Router } from 'express';
import * as menuController from '../controllers/menuController.js';
import { protect } from '../middleware/authMiddleware.js';
import authorize from '../middleware/roleMiddleware.js';
import validate from '../middleware/validateMiddleware.js';
import {
  availabilityRules,
  createMenuRules,
  idParamRule,
  listMenuRules,
  updateMenuRules,
} from '../validators/menuValidator.js';

const router = Router();
const adminOnly = [protect, authorize('admin')];

router.get('/', validate(listMenuRules), menuController.listMenu);
router.get('/:idOrSlug', menuController.getMenuItem);

router.post('/', adminOnly, validate(createMenuRules), menuController.createMenuItem);
router.put('/:id', adminOnly, validate(updateMenuRules), menuController.updateMenuItem);
router.patch(
  '/:id/availability',
  adminOnly,
  validate(availabilityRules),
  menuController.setAvailability,
);
router.delete('/:id', adminOnly, validate(idParamRule), menuController.deleteMenuItem);

export default router;
