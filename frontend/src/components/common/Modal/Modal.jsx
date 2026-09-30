import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import useLockBodyScroll from '../../../hooks/useLockBodyScroll';
import useFocusTrap from '../../../hooks/useFocusTrap';
import { EASE_OUT } from '../../../utils/motionVariants';
import styles from './Modal.module.css';

/**
 * Accessible dialog rendered in a portal (so page transforms never affect its position).
 * Closes on Escape, backdrop click, or the close button.
 */
function Modal({ open, onClose, labelledBy, size = 'md', children }) {
  const panelRef = useRef(null);
  useLockBodyScroll(open);
  useFocusTrap(panelRef, open, onClose);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <motion.div
            ref={panelRef}
            className={`${styles.panel} ${styles[size]}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: EASE_OUT } }}
            exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.18 } }}
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className={styles.close} aria-label="Close" onClick={onClose}>
              <X size={20} strokeWidth={2.2} aria-hidden="true" />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export default Modal;
