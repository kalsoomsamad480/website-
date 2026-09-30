import { useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import ChatPanel from '../ChatPanel/ChatPanel';
import useChat from '../../../hooks/useChat';
import styles from './ChatWidget.module.css';

/** Floating assistant button and panel, available on every page. */
function ChatWidget() {
  const [open, setOpen] = useState(false);
  const chat = useChat();

  return createPortal(
    <>
      <AnimatePresence>
        {open && (
          <ChatPanel chat={chat} onClose={() => setOpen(false)} onNavigate={() => setOpen(false)} />
        )}
      </AnimatePresence>
      <motion.button
        type="button"
        className={`${styles.launcher} ${open ? styles.open : ''}`}
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? 'Close assistant' : 'Chat with the Alladin Cafe assistant'}
        aria-expanded={open}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, type: 'spring', stiffness: 320, damping: 22 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? 'close' : 'open'}
            className={styles.icon}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {open ? (
              <X size={26} aria-hidden="true" />
            ) : (
              <MessageCircle size={26} aria-hidden="true" />
            )}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </>,
    document.body,
  );
}

export default ChatWidget;
