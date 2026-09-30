import Offer from '../db/models/Offer.js';
import { createContentService } from './contentService.js';

export const offerService = createContentService(Offer, {
  label: 'Offer',
  fields: ['title', 'description', 'discountText', 'image', 'validTill', 'isActive'],
  sort: { validTill: -1 },
});

export function listActiveOffers() {
  return Offer.find({ isActive: true, validTill: { $gte: new Date() } })
    .sort({ validTill: 1 })
    .lean();
}
