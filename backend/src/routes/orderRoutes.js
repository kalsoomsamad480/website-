import { Router } from 'express';
import * as orderController from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';
import authorize from '../middleware/roleMiddleware.js';
import validate from '../middleware/validateMiddleware.js';
import {
  createOrderRules,
  listOrdersRules,
  updateOrderStatusRules,
} from '../validators/orderValidator.js';

const router = Router();
const adminOnly = [protect, authorize('admin')];

router.post('/', protect, validate(createOrderRules), orderController.createOrder);
router.get('/my', protect, orderController.listMyOrders);
router.get('/', adminOnly, validate(listOrdersRules), orderController.listOrders);
router.patch(
  '/:id/status',
  adminOnly,
  validate(updateOrderStatusRules),
  orderController.updateOrderStatus,
);

export default router;
