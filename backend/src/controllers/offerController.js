import { listActiveOffers as findActiveOffers, offerService } from '../services/offerService.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const listActiveOffers = asyncHandler(async (_req, res) => {
  sendSuccess(res, { data: await findActiveOffers() });
});

export const listAllOffers = asyncHandler(async (_req, res) => {
  sendSuccess(res, { data: await offerService.listAll() });
});

export const createOffer = asyncHandler(async (req, res) => {
  const offer = await offerService.create(req.body);
  sendSuccess(res, { statusCode: 201, message: 'Offer created.', data: offer });
});

export const updateOffer = asyncHandler(async (req, res) => {
  const offer = await offerService.update(req.params.id, req.body);
  sendSuccess(res, { message: 'Offer updated.', data: offer });
});

export const deleteOffer = asyncHandler(async (req, res) => {
  await offerService.remove(req.params.id);
  sendSuccess(res, { message: 'Offer deleted.' });
});
