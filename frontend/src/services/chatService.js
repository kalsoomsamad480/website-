import api from './api';

/** Sends one message; resolves to { reply, quickReplies, action, mode }. */
export const sendChatMessage = (sessionId, message) =>
  api
    .post('/agent/chat', { sessionId, message }, { timeout: 35000 })
    .then((response) => response.data);
