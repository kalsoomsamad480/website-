import { use } from 'react';
import { ArrowRight } from 'lucide-react';
import Button from '../../common/Button/Button';
import EmptyState from '../../common/EmptyState/EmptyState';
import StatusBadge from '../../common/StatusBadge/StatusBadge';
import formatPrice from '../../../utils/formatPrice';
import { formatDateTime } from '../../../utils/formatDate';
import styles from './OrderHistory.module.css';

function OrderHistory({ ordersPromise }) {
  const orders = use(ordersPromise);

  if (!orders.length) {
    return (
      <EmptyState
        title="No orders yet."
        text="Your first flat white is one tap away."
        action={
          <Button to="/menu" icon={ArrowRight}>
            Browse the menu
          </Button>
        }
      />
    );
  }

  return (
    <ul className={styles.list}>
      {orders.map((order) => (
        <li key={order._id} className={styles.card}>
          <div className={styles.head}>
            <div>
              <p className={styles.number}>{order.orderNumber}</p>
              <p className={styles.date}>{formatDateTime(order.createdAt)}</p>
            </div>
            <StatusBadge status={order.status} />
          </div>
          <p className={styles.items}>
            {order.items.map((item) => `${item.quantity} x ${item.name}`).join(', ')}
          </p>
          <div className={styles.foot}>
            <span className={styles.type}>
              {order.orderType === 'pickup' ? 'Pickup' : 'Dine in'}
            </span>
            <span className={styles.total}>{formatPrice(order.total)}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default OrderHistory;
