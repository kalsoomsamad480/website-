import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, X } from 'lucide-react';
import ChatMessage from '../ChatMessage/ChatMessage';
import ChatInput from '../ChatInput/ChatInput';
import QuickReplies from '../QuickReplies/QuickReplies';
import { EASE_OUT } from '../../../utils/motionVariants';
import styles from './ChatPanel.module.css';

function ChatPanel({ chat, onClose, onNavigate }) {
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const last = chat.messages[chat.messages.length - 1];

  // Keep the newest message in view
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [chat.messages.length, chat.pending]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <motion.section
      className={styles.panel}
      role="dialog"
      aria-label="Alladin Cafe assistant"
      initial={{ opacity: 0, scale: 0.94, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.28, ease: EASE_OUT } }}
      exit={{ opacity: 0, scale: 0.96, y: 12, transition: { duration: 0.18 } }}
      onKeyDown={(event) => event.key === 'Escape' && onClose()}
    >
      <header className={styles.header}>
        <span className={styles.avatar} aria-hidden="true">
          <svg viewBox="0 0 40 40">
            <path d="M11 18h15v5a7.5 7.5 0 0 1-15 0z" fill="currentColor" />
            <path
              d="M26 20h1.5a3 3 0 0 1 0 6H25.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <div className={styles.titles}>
          <h2 className={styles.title}>Alladin Cafe assistant</h2>
          <p className={styles.subtitle}>Menu, hours, offers, and bookings</p>
        </div>
        <button
          type="button"
          className={styles.iconButton}
          onClick={chat.reset}
          aria-label="Start a new conversation"
        >
          <RotateCcw size={18} aria-hidden="true" />
        </button>
        <button
          type="button"
          className={styles.iconButton}
          onClick={onClose}
          aria-label="Close assistant"
        >
          <X size={20} aria-hidden="true" />
        </button>
      </header>

      <ol
        ref={listRef}
        className={styles.messages}
        role="log"
        aria-live="polite"
        aria-label="Conversation"
      >
        {chat.messages.map((message) => (
          <ChatMessage key={message.id} message={message} onNavigate={onNavigate} />
        ))}
        {chat.pending && (
          <li className={styles.thinking} aria-label="The assistant is typing">
            Thinking
          </li>
        )}
      </ol>

      {!chat.pending && last?.role === 'assistant' && (
        <div className={styles.quick}>
          <QuickReplies options={last.quickReplies} onPick={chat.send} disabled={chat.pending} />
        </div>
      )}

      <ChatInput onSend={chat.send} disabled={chat.pending} inputRef={inputRef} />
    </motion.section>
  );
}

export default ChatPanel;
