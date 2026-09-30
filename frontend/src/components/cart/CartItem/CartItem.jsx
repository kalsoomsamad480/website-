import { Trash2 } from 'lucide-react';
import QuantityStepper from '../../common/QuantityStepper/QuantityStepper';
import formatPrice from '../../../utils/formatPrice';
import styles from './CartItem.module.css';

/** One cart line. `warning` shows a problem such as "Sold out today". */
function CartItem({ item, price = item.price, warning, onQuantityChange, onRemove }) {
  return (
    <li className={`${styles.item} ${warning ? styles.hasWarning : ''}`}>
      <img src={item.image} alt="" width={72} height={72} className={styles.thumb} />
      <div className={styles.info}>
        <div className={styles.row}>
          <p className={styles.name}>{item.name}</p>
          <p className={styles.lineTotal}>{formatPrice(price * item.quantity)}</p>
        </div>
        <p className={styles.unit}>{formatPrice(price)} each</p>
        {warning && <p className={styles.warning}>{warning}</p>}
        <div className={styles.controls}>
          <QuantityStepper
            value={item.quantity}
            onChange={(quantity) => onQuantityChange(item.id, quantity)}
            min={1}
            label={`${item.name} quantity`}
          />
          <button type="button" className={styles.remove} onClick={() => onRemove(item.id)}>
            <Trash2 size={16} aria-hidden="true" />
            Remove
            <span className="visually-hidden"> {item.name}</span>
          </button>
        </div>
      </div>
    </li>
  );
}

export default CartItem;
