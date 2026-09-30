import formatPrice from '../../../utils/formatPrice';
import styles from './CartSummary.module.css';

function CartSummary({ subtotal, tax, total }) {
  return (
    <dl className={styles.summary}>
      <div className={styles.row}>
        <dt>Subtotal</dt>
        <dd>{formatPrice(subtotal)}</dd>
      </div>
      <div className={styles.row}>
        <dt>Tax (8%)</dt>
        <dd>{formatPrice(tax)}</dd>
      </div>
      <div className={`${styles.row} ${styles.total}`}>
        <dt>Total</dt>
        <dd>{formatPrice(total)}</dd>
      </div>
    </dl>
  );
}

export default CartSummary;
