import ContactMessage from '../db/models/ContactMessage.js';
import ApiError from '../utils/ApiError.js';
import { pick } from '../utils/helpers.js';

export function createMessage(data) {
  return ContactMessage.create(pick(data, ['name', 'email', 'subject', 'message']));
}

export function listMessages() {
  return ContactMessage.find().sort({ createdAt: -1 }).lean();
}

export async function setRead(id, isRead) {
  const message = await ContactMessage.findByIdAndUpdate(
    id,
    { isRead },
    { returnDocument: 'after' },
  ).lean();
  if (!message) throw ApiError.notFound('Message not found.');
  return message;
}

export async function deleteMessage(id) {
  const message = await ContactMessage.findByIdAndDelete(id);
  if (!message) throw ApiError.notFound('Message not found.');
}
