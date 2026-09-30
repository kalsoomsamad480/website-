import { Router } from 'express';
import * as reservationController from '../controllers/reservationController.js';
import { optionalAuth, protect } from '../middleware/authMiddleware.js';
import authorize from '../middleware/roleMiddleware.js';
import { reservationLimiter } from '../middleware/rateLimiter.js';
import trustedAgent from '../middleware/trustedAgent.js';
import validate from '../middleware/validateMiddleware.js';
import {
  availabilityRules,
  createReservationRules,
  listReservationsRules,
  rescheduleRules,
  reservationIdRule,
  updateReservationStatusRules,
} from '../validators/reservationValidator.js';

const router = Router();
const adminOnly = [protect, authorize('admin')];

router.get('/availability', validate(availabilityRules), reservationController.getAvailability);
router.post(
  '/',
  trustedAgent,
  reservationLimiter,
  optionalAuth,
  validate(createReservationRules),
  reservationController.createReservation,
);
router.get('/my', protect, reservationController.listMyReservations);
router.patch(
  '/:id/cancel',
  protect,
  validate(reservationIdRule),
  reservationController.cancelMyReservation,
);

router.get('/', adminOnly, validate(listReservationsRules), reservationController.listReservations);
router.patch(
  '/:id/status',
  adminOnly,
  validate(updateReservationStatusRules),
  reservationController.updateReservationStatus,
);
router.patch(
  '/:id/reschedule',
  adminOnly,
  validate(rescheduleRules),
  reservationController.rescheduleReservation,
);

export default router;
