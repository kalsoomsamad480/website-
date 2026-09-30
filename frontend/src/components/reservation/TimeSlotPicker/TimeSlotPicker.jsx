import { use } from 'react';
import { formatTime } from '../../../utils/openingHours';
import styles from './TimeSlotPicker.module.css';

const PERIODS = [
  { label: 'Morning', test: (hour) => hour < 12 },
  { label: 'Afternoon', test: (hour) => hour >= 12 && hour < 17 },
  { label: 'Evening', test: (hour) => hour >= 17 },
];

/** Time slots from the availability API, grouped by part of day. Full slots are disabled. */
function TimeSlotPicker({ slotsPromise, guests, value, onChange }) {
  const slots = use(slotsPromise);

  if (!slots.length) {
    return <p className={styles.empty}>No times left on this day. Please choose another date.</p>;
  }

  return (
    <div className={styles.periods} role="radiogroup" aria-label="Time">
      {PERIODS.map((period) => {
        const periodSlots = slots.filter((slot) => period.test(Number(slot.time.slice(0, 2))));
        if (!periodSlots.length) return null;
        return (
          <div key={period.label} className={styles.period}>
            <p className={styles.periodLabel}>{period.label}</p>
            <div className={styles.slots}>
              {periodSlots.map((slot) => {
                const fits = slot.remaining >= guests;
                const selected = slot.time === value;
                return (
                  <button
                    key={slot.time}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    disabled={!fits}
                    className={`${styles.slot} ${selected ? styles.selected : ''}`}
                    onClick={() => onChange(slot.time)}
                  >
                    {formatTime(slot.time)}
                    {!fits && <span className="visually-hidden"> (full)</span>}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TimeSlotPicker;
