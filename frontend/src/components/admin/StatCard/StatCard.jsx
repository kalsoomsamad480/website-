import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import styles from './StatCard.module.css';

/** A single headline number (no chart needed for one value). */
function StatCard({ label, value, note, to, highlight = false }) {
  const content = (
    <>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
      {note && <span className={styles.note}>{note}</span>}
      {to && <ArrowUpRight className={styles.arrow} size={18} aria-hidden="true" />}
    </>
  );

  const className = `${styles.card} ${highlight ? styles.highlight : ''}`;
  return to ? (
    <Link to={to} className={`${className} ${styles.link}`}>
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  );
}

export default StatCard;
