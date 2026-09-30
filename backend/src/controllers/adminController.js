import { getDashboardStats } from '../services/statsService.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getStats = asyncHandler(async (_req, res) => {
  sendSuccess(res, { data: await getDashboardStats() });
});
