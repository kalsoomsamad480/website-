import styles from './Loader.module.css';

function Loader({ fullPage = false, label = 'Loading' }) {
  return (
    <div className={fullPage ? styles.fullPage : styles.inline} role="status">
      <span className={styles.ring} aria-hidden="true" />
      <span className="visually-hidden">{label}</span>
    </div>
  );
}

export default Loader;
