import styles from './DataTable.module.css';

/** Scrollable table shell with consistent admin styling. Children are <thead>/<tbody>. */
function DataTable({ caption, children, minWidth = 720 }) {
  return (
    <div className={styles.scroll} tabIndex={0} role="region" aria-label={caption}>
      <table className={styles.table} style={{ minWidth }}>
        <caption className="visually-hidden">{caption}</caption>
        {children}
      </table>
    </div>
  );
}

export default DataTable;
