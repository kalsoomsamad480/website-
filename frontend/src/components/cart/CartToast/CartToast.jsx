import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import useCart from '../../../hooks/useCart';
import { EASE_OUT } from '../../../utils/motionVariants';
import styles from './CartToast.module.css';

const VISIBLE_MS = 2800;

/** Short confirmation after adding an item, with a shortcut to the cart. */
function CartToast() {
  const { toast, dismissToast, openCart } = useCart();

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(dismissToast, VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [toast, dismissToast]);

  return (
    <div className={styles.region} aria-live="polite">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.key}
            className={styles.toast}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE_OUT } }}
            exit={{ opacity: 0, y: 12, transition: { duration: 0.2 } }}
          >
            <span className={styles.icon} aria-hidden="true">
              <Check size={16} strokeWidth={3} />
            </span>
            <p className={styles.text}>
              <strong>{toast.name}</strong> added to your order
            </p>
            <button type="button" className={styles.action} onClick={openCart}>
              View cart
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CartToast;
