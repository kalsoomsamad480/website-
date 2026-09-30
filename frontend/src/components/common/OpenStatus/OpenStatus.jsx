import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { getOpenStatus } from '../../../utils/openingHours';
import styles from './OpenStatus.module.css';

/** Live opening status, refreshed every minute. */
function OpenStatus({ tone = 'dark', className = '' }) {
  const [status, setStatus] = useState(() => getOpenStatus());

  useEffect(() => {
    const timer = setInterval(() => setStatus(getOpenStatus()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const classes = [
    styles.status,
    status.isOpen ? styles.open : styles.closed,
    tone === 'light' && styles.light,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <p className={classes}>
      <Clock className={styles.icon} size={16} strokeWidth={2.2} aria-hidden="true" />
      <span>
        <span className="visually-hidden">{status.isOpen ? 'Open now. ' : 'Closed now. '}</span>
        {status.label}
      </span>
    </p>
  );
}

export default OpenStatus;
