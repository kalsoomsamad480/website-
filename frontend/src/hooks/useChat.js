import { useCallback, useEffect, useState } from 'react';
import { sendChatMessage } from '../services/chatService';

const SESSION_KEY = 'studymind.chat.session';
const MESSAGES_KEY = 'studymind.chat.messages';

const GREETING = {
  id: 'greeting',
  role: 'assistant',
  text: 'Hi! I am the Alladin Cafe assistant. Ask me about the menu, opening hours, offers, or the study space. I can also book a seat for you.',
  quickReplies: ['Recommend a coffee', 'Opening hours', "Today's offers", 'Book a table'],
};

const newId = () =>
  (crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`)
    .replace(/[^A-Za-z0-9]/g, '')
    .slice(0, 32);

function readStorage(key, fallback) {
  try {
    const value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage blocked: the chat still works for this page view
  }
}

/** Chat state for this browser tab. The agent remembers context per session id. */
export default function useChat() {
  const [sessionId, setSessionId] = useState(() => readStorage(SESSION_KEY, null) || newId());
  const [messages, setMessages] = useState(() => readStorage(MESSAGES_KEY, [GREETING]));
  const [pending, setPending] = useState(false);

  useEffect(() => writeStorage(SESSION_KEY, sessionId), [sessionId]);
  useEffect(() => writeStorage(MESSAGES_KEY, messages), [messages]);

  const send = useCallback(
    async (text) => {
      const message = text.trim().slice(0, 500);
      if (!message || pending) return;

      setMessages((current) => [...current, { id: newId(), role: 'user', text: message }]);
      setPending(true);
      try {
        const reply = await sendChatMessage(sessionId, message);
        setMessages((current) => [
          ...current,
          {
            id: newId(),
            role: 'assistant',
            text: reply.reply,
            quickReplies: reply.quickReplies,
            action: reply.action,
          },
        ]);
      } catch (error) {
        setMessages((current) => [
          ...current,
          { id: newId(), role: 'assistant', text: error.message, isError: true },
        ]);
      } finally {
        setPending(false);
      }
    },
    [pending, sessionId],
  );

  const reset = useCallback(() => {
    setSessionId(newId());
    setMessages([GREETING]);
  }, []);

  return { messages, pending, send, reset };
}
