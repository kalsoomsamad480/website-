import { parseDateString } from '../../../utils/formatDate';
import styles from './DatePicker.module.css';

const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'short' });
const month = new Intl.DateTimeFormat('en-US', { month: 'short' });

/** Horizontally scrolling day chips. dates = ["YYYY-MM-DD", ...] starting today. */
function DatePicker({ dates, value, onChange }) {
  return (
    <div className={styles.scroller}>
      <div className={styles.list} role="radiogroup" aria-label="Date">
        {dates.map((date, index) => {
          const day = parseDateString(date);
          const selected = date === value;
          const label = index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : weekday.format(day);
          return (
            <button
              key={date}
              type="button"
              role="radio"
              aria-checked={selected}
              className={`${styles.day} ${selected ? styles.selected : ''}`}
              onClick={() => onChange(date)}
            >
              <span className={styles.weekday}>{label}</span>
              <span className={styles.number}>{day.getDate()}</span>
              <span className={styles.month}>{month.format(day)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default DatePicker;
