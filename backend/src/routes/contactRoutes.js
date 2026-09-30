import { Router } from 'express';
import * as contactController from '../controllers/contactController.js';
import { protect } from '../middleware/authMiddleware.js';
import authorize from '../middleware/roleMiddleware.js';
import { contactLimiter } from '../middleware/rateLimiter.js';
import validate from '../middleware/validateMiddleware.js';
import { contactRules } from '../validators/contactValidator.js';
import { idRule, markReadRules } from '../validators/contentValidator.js';

const router = Router();
const adminOnly = [protect, authorize('admin')];

router.post('/', contactLimiter, validate(contactRules), contactController.sendMessage);
router.get('/', adminOnly, contactController.listMessages);
router.patch('/:id/read', adminOnly, validate(markReadRules), contactController.setRead);
router.delete('/:id', adminOnly, validate(idRule), contactController.deleteMessage);

export default router;
