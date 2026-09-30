import { Router } from 'express';
import { listGallery } from '../controllers/galleryController.js';

const router = Router();

router.get('/', listGallery);

export default router;
