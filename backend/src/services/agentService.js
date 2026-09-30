import env from '../config/env.js';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

const OFFLINE_MESSAGE =
  'Our assistant is taking a short break. Please try again soon, or contact us at hello@alladin.cafe.';

/** Forwards a chat message to the Python agent and returns a camelCase reply. */
export async function sendChatMessage({ sessionId, message }) {
  let response;
  try {
    response = await fetch(`${env.agentUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId, message }),
      signal: AbortSignal.timeout(30_000),
    });
  } catch (error) {
    logger.warn('Agent unreachable:', error.message);
    throw new ApiError(503, OFFLINE_MESSAGE);
  }

  if (!response.ok) {
    logger.warn(`Agent returned ${response.status}`);
    throw new ApiError(
      response.status === 422 ? 422 : 503,
      response.status === 422 ? 'That message could not be sent.' : OFFLINE_MESSAGE,
    );
  }

  const data = await response.json();
  return {
    reply: data.reply,
    quickReplies: data.quick_replies || [],
    action: data.action || null,
    mode: data.mode,
  };
}
