import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import Button from '../../common/Button/Button';
import StatusBadge from '../../common/StatusBadge/StatusBadge';
import CartSummary from '../../cart/CartSummary/CartSummary';
import formatPrice from '../../../utils/formatPrice';
import { fadeUp, staggerContainer } from '../../../utils/motionVariants';
import styles from './OrderSuccess.module.css';

const PAYMENT_LABELS = {
  cash: 'Pay at the counter',
  card: 'Card (demo)',
  wallet: 'Mobile wallet (demo)',
};

function OrderSuccess({ order }) {
  return (
    <motion.section
      className={`container ${styles.wrap}`}
      variants={staggerContainer(0.08)}
      initial="hidden"
      animate="visible"
      aria-labelledby="order-success-title"
    >
      <motion.span className={styles.check} variants={fadeUp} aria-hidden="true">
        <Check size={32} strokeWidth={3} />
      </motion.span>
      <motion.span className="eyebrow" variants={fadeUp}>
        Order {order.orderNumber}
      </motion.span>
      <motion.h1 id="order-success-title" variants={fadeUp}>
        Order <em>placed</em>. Thank you.
      </motion.h1>
      <motion.p className="lead" variants={fadeUp}>
        {order.orderType === 'pickup'
          ? 'We are on it. Your order will be ready at the counter in about 15 minutes.'
          : 'Find a comfortable seat. We will bring your order to your table.'}
      </motion.p>

      <motion.div className={styles.card} variants={fadeUp}>
        <div className={styles.cardHead}>
          <StatusBadge status={order.status} />
          <span className={styles.meta}>
            {order.orderType === 'pickup' ? 'Pickup' : 'Dine in'},{' '}
            {PAYMENT_LABELS[order.paymentMethod]}
          </span>
        </div>
        <ul className={styles.lines}>
          {order.items.map((item) => (
            <li key={item.menuItem}>
              <span>
                {item.quantity} x {item.name}
              </span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <CartSummary subtotal={order.subtotal} tax={order.tax} total={order.total} />
        {order.notes && <p className={styles.notes}>Note: {order.notes}</p>}
      </motion.div>

      <motion.div className={styles.actions} variants={fadeUp}>
        <Button to="/profile?tab=orders" icon={ArrowRight}>
          Track my orders
        </Button>
        <Button to="/menu" variant="ghost">
          Back to the menu
        </Button>
      </motion.div>
    </motion.section>
  );
}

export default OrderSuccess;
