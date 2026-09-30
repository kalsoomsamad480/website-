import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Info, X } from 'lucide-react';
import { EASE_OUT } from '../../../utils/motionVariants';
import styles from './FlashNotice.module.css';

const VISIBLE_MS = 6000;

/**
 * One-time message passed through navigation state, e.g.
 * navigate('/', { state: { notice: 'The admin panel is for staff only.' } }).
 */
function FlashNotice() {
  const location = useLocation();
  const notice = location.state?.notice;
  const [dismissedKey, setDismissedKey] = useState(null);
  const visible = Boolean(notice) && dismissedKey !== location.key;

  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setDismissedKey(location.key), VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [notice, location.key]);

  return (
    <div className={styles.region} aria-live="polite">
      <AnimatePresence>
        {visible && (
          <motion.div
            key={location.key}
            className={styles.notice}
            role="status"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE_OUT } }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
          >
            <span className={styles.icon} aria-hidden="true">
              <Info size={16} strokeWidth={2.6} />
            </span>
            <p className={styles.text}>{notice}</p>
            <button
              type="button"
              className={styles.close}
              onClick={() => setDismissedKey(location.key)}
              aria-label="Dismiss message"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FlashNotice;
