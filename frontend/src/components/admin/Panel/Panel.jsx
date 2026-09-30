import styles from './Panel.module.css';

/** White card section used across the admin screens. */
function Panel({ title, actions, children, className = '', flush = false }) {
  return (
    <section
      className={`${styles.panel} ${className}`}
      aria-label={typeof title === 'string' ? title : undefined}
    >
      {(title || actions) && (
        <header className={styles.head}>
          {title && <h2 className={styles.title}>{title}</h2>}
          {actions}
        </header>
      )}
      <div className={flush ? styles.flush : styles.body}>{children}</div>
    </section>
  );
}

export default Panel;
