import { Router } from 'express';
import * as offerController from '../controllers/offerController.js';
import { protect } from '../middleware/authMiddleware.js';
import authorize from '../middleware/roleMiddleware.js';
import validate from '../middleware/validateMiddleware.js';
import { createOfferRules, idRule, updateOfferRules } from '../validators/contentValidator.js';

const router = Router();
const adminOnly = [protect, authorize('admin')];

router.get('/', offerController.listActiveOffers);
router.get('/all', adminOnly, offerController.listAllOffers);
router.post('/', adminOnly, validate(createOfferRules), offerController.createOffer);
router.put('/:id', adminOnly, validate(updateOfferRules), offerController.updateOffer);
router.delete('/:id', adminOnly, validate(idRule), offerController.deleteOffer);

export default router;
