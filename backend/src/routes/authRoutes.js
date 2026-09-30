import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authLimiter, refreshLimiter, registerLimiter } from '../middleware/rateLimiter.js';
import validate from '../middleware/validateMiddleware.js';
import { loginRules, registerRules, updateProfileRules } from '../validators/authValidator.js';

const router = Router();

router.post('/register', registerLimiter, validate(registerRules), authController.register);
router.post('/login', authLimiter, validate(loginRules), authController.login);
router.post('/refresh', refreshLimiter, authController.refresh);
router.post('/logout', authController.logout);
router.get('/me', protect, authController.getMe);
router.put('/me', protect, validate(updateProfileRules), authController.updateMe);

export default router;
