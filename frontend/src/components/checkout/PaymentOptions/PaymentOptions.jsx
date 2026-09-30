import { Banknote, CreditCard, Smartphone } from 'lucide-react';
import styles from './PaymentOptions.module.css';

const OPTIONS = [
  {
    value: 'cash',
    label: 'Pay at the counter',
    note: 'Cash or card when you collect',
    icon: Banknote,
  },
  { value: 'card', label: 'Card', note: 'Demo only, nothing is charged', icon: CreditCard },
  {
    value: 'wallet',
    label: 'Mobile wallet',
    note: 'Demo only, nothing is charged',
    icon: Smartphone,
  },
];

/** Payment method as large radio cards (native radios for accessibility). */
function PaymentOptions({ value, onChange }) {
  return (
    <fieldset className={styles.options}>
      <legend className="visually-hidden">Payment method</legend>
      {OPTIONS.map((option) => {
        const Icon = option.icon;
        const checked = value === option.value;
        return (
          <label key={option.value} className={`${styles.option} ${checked ? styles.checked : ''}`}>
            <input
              type="radio"
              name="paymentMethod"
              value={option.value}
              checked={checked}
              onChange={() => onChange(option.value)}
              className={styles.input}
            />
            <Icon className={styles.icon} size={22} aria-hidden="true" />
            <span className={styles.text}>
              <span className={styles.label}>{option.label}</span>
              <span className={styles.note}>{option.note}</span>
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}

export default PaymentOptions;
