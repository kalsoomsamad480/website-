import styles from './FilterChips.module.css';

/** options = [{ value, label, count? }] */
function FilterChips({ options, value, onChange, label }) {
  return (
    <div className={styles.chips} role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`${styles.chip} ${option.value === value ? styles.active : ''}`}
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
          {option.count != null && <span className={styles.count}>{option.count}</span>}
        </button>
      ))}
    </div>
  );
}

export default FilterChips;
