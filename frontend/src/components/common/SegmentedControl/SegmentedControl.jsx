import { useId } from 'react';
import { motion } from 'framer-motion';
import { navPillSpring } from '../../../utils/motionVariants';
import styles from './SegmentedControl.module.css';

/** A small set of mutually exclusive options with a sliding highlight. options = [{ value, label }] */
function SegmentedControl({ options, value, onChange, label, fullWidth = false }) {
  const pillId = useId();

  return (
    <div
      className={`${styles.control} ${fullWidth ? styles.full : ''}`}
      role="radiogroup"
      aria-label={label}
    >
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            className={`${styles.option} ${isActive ? styles.active : ''}`}
            onClick={() => onChange(option.value)}
          >
            {isActive && (
              <motion.span layoutId={pillId} className={styles.pill} transition={navPillSpring} />
            )}
            <span className={styles.label}>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default SegmentedControl;
