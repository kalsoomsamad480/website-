import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import useLockBodyScroll from '../../../hooks/useLockBodyScroll';
import useFocusTrap from '../../../hooks/useFocusTrap';
import { EASE_OUT } from '../../../utils/motionVariants';
import styles from './Lightbox.module.css';

const SWIPE_DISTANCE = 60;

/** Full-screen image viewer: arrow keys, swipe, Escape to close. */
function Lightbox({ images, index, open, onClose, onChange }) {
  const panelRef = useRef(null);
  useLockBodyScroll(open);
  useFocusTrap(panelRef, open, onClose);

  const count = images.length;
  const go = (step) => onChange((index + step + count) % count);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === 'ArrowRight') onChange((index + 1) % count);
      if (event.key === 'ArrowLeft') onChange((index - 1 + count) % count);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, index, count, onChange]);

  const image = images[index];

  return createPortal(
    <AnimatePresence>
      {open && image && (
        <motion.div
          ref={panelRef}
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className={styles.top}>
            <p className={styles.counter}>
              {index + 1} / {count}
            </p>
            <button
              type="button"
              className={styles.button}
              onClick={onClose}
              aria-label="Close photo viewer"
            >
              <X size={22} aria-hidden="true" />
            </button>
          </div>

          <div className={styles.stage}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={image._id}
                src={image.src}
                alt={image.alt}
                className={styles.image}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1, transition: { duration: 0.3, ease: EASE_OUT } }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.4}
                onDragEnd={(_event, info) => {
                  if (info.offset.x < -SWIPE_DISTANCE) go(1);
                  else if (info.offset.x > SWIPE_DISTANCE) go(-1);
                }}
              />
            </AnimatePresence>
          </div>

          <div className={styles.bottom}>
            <button
              type="button"
              className={styles.button}
              onClick={() => go(-1)}
              aria-label="Previous photo"
            >
              <ArrowLeft size={22} aria-hidden="true" />
            </button>
            <p className={styles.caption} aria-live="polite">
              {image.alt}
            </p>
            <button
              type="button"
              className={styles.button}
              onClick={() => go(1)}
              aria-label="Next photo"
            >
              <ArrowRight size={22} aria-hidden="true" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export default Lightbox;
