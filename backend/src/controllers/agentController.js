import * as agentService from '../services/agentService.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const chat = asyncHandler(async (req, res) => {
  const reply = await agentService.sendChatMessage(req.body);
  sendSuccess(res, { data: reply });
});
