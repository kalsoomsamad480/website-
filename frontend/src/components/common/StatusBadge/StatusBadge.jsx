import styles from './StatusBadge.module.css';

const LABELS = {
  pending: 'Pending',
  preparing: 'Preparing',
  ready: 'Ready for pickup',
  completed: 'Completed',
  cancelled: 'Cancelled',
  approved: 'Confirmed',
  rejected: 'Declined',
};

/** Order or reservation status as a colored pill. */
function StatusBadge({ status }) {
  return (
    <span className={`${styles.badge} ${styles[status] || ''}`}>{LABELS[status] || status}</span>
  );
}

export default StatusBadge;
