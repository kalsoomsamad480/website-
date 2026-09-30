import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import Button from '../../common/Button/Button';
import CartItem from '../CartItem/CartItem';
import CartSummary from '../CartSummary/CartSummary';
import useCart from '../../../hooks/useCart';
import useFocusTrap from '../../../hooks/useFocusTrap';
import useLockBodyScroll from '../../../hooks/useLockBodyScroll';
import { EASE_IN, EASE_OUT } from '../../../utils/motionVariants';
import styles from './CartDrawer.module.css';

/** Cart panel that slides in from the right over a fading backdrop. */
function CartDrawer() {
  const cart = useCart();
  const panelRef = useRef(null);
  useLockBodyScroll(cart.isOpen);
  useFocusTrap(panelRef, cart.isOpen, cart.closeCart);

  return createPortal(
    <AnimatePresence>
      {cart.isOpen && (
        <motion.div
          className={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={cart.closeCart}
        >
          <motion.aside
            ref={panelRef}
            className={styles.panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            initial={{ x: '100%' }}
            animate={{ x: 0, transition: { duration: 0.4, ease: EASE_OUT } }}
            exit={{ x: '100%', transition: { duration: 0.3, ease: EASE_IN } }}
            onClick={(event) => event.stopPropagation()}
          >
            <header className={styles.header}>
              <h2 id="cart-title" className={styles.title}>
                Your <em>order</em>
                {cart.count > 0 && <span className={styles.count}>{cart.count}</span>}
              </h2>
              <button
                type="button"
                className={styles.close}
                onClick={cart.closeCart}
                aria-label="Close cart"
              >
                <X size={22} aria-hidden="true" />
              </button>
            </header>

            {cart.items.length === 0 ? (
              <div className={styles.empty}>
                <p className={styles.emptyTitle}>Your cart is empty.</p>
                <p className={styles.emptyText}>
                  Add a flat white or a cardamom bun to get started.
                </p>
                <Button to="/menu" onClick={cart.closeCart} icon={ArrowRight}>
                  Browse the menu
                </Button>
              </div>
            ) : (
              <>
                <ul className={styles.list}>
                  {cart.items.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onQuantityChange={cart.updateQuantity}
                      onRemove={cart.removeItem}
                    />
                  ))}
                </ul>
                <footer className={styles.footer}>
                  <CartSummary subtotal={cart.subtotal} tax={cart.tax} total={cart.total} />
                  <Button
                    to="/checkout"
                    onClick={cart.closeCart}
                    size="lg"
                    icon={ArrowRight}
                    fullWidth
                  >
                    Go to checkout
                  </Button>
                  <button type="button" className={styles.keepBrowsing} onClick={cart.closeCart}>
                    Keep browsing
                  </button>
                </footer>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export default CartDrawer;
