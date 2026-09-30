import * as contactService from '../services/contactService.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const sendMessage = asyncHandler(async (req, res) => {
  const message = await contactService.createMessage(req.body);
  sendSuccess(res, {
    statusCode: 201,
    message: 'Thanks for your message. We usually reply within a day.',
    data: { id: message.id },
  });
});

export const listMessages = asyncHandler(async (_req, res) => {
  sendSuccess(res, { data: await contactService.listMessages() });
});

export const setRead = asyncHandler(async (req, res) => {
  const message = await contactService.setRead(req.params.id, req.body.isRead);
  sendSuccess(res, {
    message: message.isRead ? 'Marked as read.' : 'Marked as unread.',
    data: message,
  });
});

export const deleteMessage = asyncHandler(async (req, res) => {
  await contactService.deleteMessage(req.params.id);
  sendSuccess(res, { message: 'Message deleted.' });
});
