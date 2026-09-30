import { Router } from 'express';
import * as adminController from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import authorize from '../middleware/roleMiddleware.js';

const router = Router();

router.use(protect, authorize('admin'));
router.get('/stats', adminController.getStats);

export default router;
