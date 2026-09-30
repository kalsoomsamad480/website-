import styles from './EmptyState.module.css';

function EmptyState({ title, text, action, tone = 'light' }) {
  return (
    <div className={`${styles.state} ${tone === 'dark' ? styles.dark : ''}`} role="status">
      <p className={styles.title}>{title}</p>
      {text && <p className={styles.text}>{text}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}

export default EmptyState;
