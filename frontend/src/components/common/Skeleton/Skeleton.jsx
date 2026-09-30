import styles from './Skeleton.module.css';

/** Gray placeholder block shown while content loads. */
function Skeleton({ width = '100%', height = 16, radius = 'var(--radius-sm)', className = '' }) {
  return (
    <span
      className={`${styles.skeleton} ${className}`}
      style={{ width, height, borderRadius: radius }}
      aria-hidden="true"
    />
  );
}

export default Skeleton;
