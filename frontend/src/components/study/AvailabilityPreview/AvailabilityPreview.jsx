import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getDemoAvailability } from '../../../utils/studyAvailability';
import { EASE_OUT } from '../../../utils/motionVariants';
import styles from './AvailabilityPreview.module.css';

/** Demo seat availability per zone, refreshed every minute. */
function AvailabilityPreview({ zones }) {
  const [availability, setAvailability] = useState(() => getDemoAvailability(zones));

  useEffect(() => {
    const timer = setInterval(() => setAvailability(getDemoAvailability(zones)), 60_000);
    return () => clearInterval(timer);
  }, [zones]);

  return (
    <div className={styles.panel}>
      <div className={styles.head}>
        <h3 className={styles.title}>Seats right now</h3>
        <span className={styles.demo}>Demo preview</span>
      </div>

      {!availability.isOpen && (
        <p className={styles.closed}>
          We are closed right now. Here is what a normal day looks like at opening.
        </p>
      )}

      <ul className={styles.list}>
        {availability.zones.map((zone) => {
          const free = availability.isOpen ? zone.free : zone.seats;
          const ratio = free / zone.seats;
          return (
            <li key={zone.name} className={styles.row}>
              <div className={styles.labels}>
                <span className={styles.zone}>{zone.name}</span>
                <span className={styles.count}>
                  <strong>{free}</strong> of {zone.seats} free
                </span>
              </div>
              <div
                className={styles.track}
                role="meter"
                aria-label={`${zone.name} free seats`}
                aria-valuemin={0}
                aria-valuemax={zone.seats}
                aria-valuenow={free}
              >
                <motion.span
                  className={styles.fill}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: ratio }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: EASE_OUT }}
                />
              </div>
            </li>
          );
        })}
      </ul>
      <p className={styles.note}>Live availability connects to reservations in the next update.</p>
    </div>
  );
}

export default AvailabilityPreview;
