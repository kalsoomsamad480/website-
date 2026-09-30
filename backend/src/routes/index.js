import { Router } from 'express';
import mongoose from 'mongoose';
import authRoutes from './authRoutes.js';
import menuRoutes from './menuRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import infoRoutes from './infoRoutes.js';
import offerRoutes from './offerRoutes.js';
import testimonialRoutes from './testimonialRoutes.js';
import galleryRoutes from './galleryRoutes.js';
import contactRoutes from './contactRoutes.js';
import orderRoutes from './orderRoutes.js';
import reservationRoutes from './reservationRoutes.js';
import agentRoutes from './agentRoutes.js';
import adminRoutes from './adminRoutes.js';
import { sendSuccess } from '../utils/apiResponse.js';

const router = Router();

router.get('/health', (_req, res) => {
  sendSuccess(res, {
    message: 'Alladin Cafe API is running.',
    data: {
      status: 'ok',
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      uptimeSeconds: Math.round(process.uptime()),
    },
  });
});

router.use('/auth', authRoutes);
router.use('/menu', menuRoutes);
router.use('/categories', categoryRoutes);
router.use('/info', infoRoutes);
router.use('/offers', offerRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/gallery', galleryRoutes);
router.use('/contact', contactRoutes);
router.use('/orders', orderRoutes);
router.use('/reservations', reservationRoutes);
router.use('/agent', agentRoutes);
router.use('/admin', adminRoutes);

export default router;
