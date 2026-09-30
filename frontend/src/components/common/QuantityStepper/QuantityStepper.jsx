import { Minus, Plus } from 'lucide-react';
import styles from './QuantityStepper.module.css';

/** Minus / value / plus control. `label` names the thing being counted for screen readers. */
function QuantityStepper({ value, onChange, min = 0, max = 20, label = 'quantity', size = 'md' }) {
  return (
    <div className={`${styles.stepper} ${styles[size]}`} role="group" aria-label={label}>
      <button
        type="button"
        className={styles.button}
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label={`Decrease ${label}`}
      >
        <Minus size={16} strokeWidth={2.4} aria-hidden="true" />
      </button>
      <output className={styles.value} aria-live="polite">
        {value}
      </output>
      <button
        type="button"
        className={styles.button}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={`Increase ${label}`}
      >
        <Plus size={16} strokeWidth={2.4} aria-hidden="true" />
      </button>
    </div>
  );
}

export default QuantityStepper;
