import { Router } from 'express';
import * as agentController from '../controllers/agentController.js';
import { chatLimiter } from '../middleware/rateLimiter.js';
import validate from '../middleware/validateMiddleware.js';
import { chatRules } from '../validators/agentValidator.js';

const router = Router();

router.post('/chat', chatLimiter, validate(chatRules), agentController.chat);

export default router;
