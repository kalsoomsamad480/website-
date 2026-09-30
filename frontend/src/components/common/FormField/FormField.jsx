import { useId } from 'react';
import styles from './FormField.module.css';

/** Labeled input or textarea with hint and error text wired up for screen readers. */
function FormField({
  label,
  error,
  hint,
  as = 'input',
  optional = false,
  className = '',
  ...inputProps
}) {
  const id = useId();
  const describedBy =
    [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;
  const Control = as;

  return (
    <div className={`${styles.field} ${className}`}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {optional && <span className={styles.optional}>Optional</span>}
      </label>
      <Control
        id={id}
        className={`${styles.control} ${error ? styles.invalid : ''}`}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        {...inputProps}
      />
      {hint && !error && (
        <p id={`${id}-hint`} className={styles.hint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}

export default FormField;
