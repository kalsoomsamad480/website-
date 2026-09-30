import { Link } from 'react-router-dom';
import styles from './Logo.module.css';

/** Genie rising from his tail, holding up a steaming cup. */
function Logo({ tone = 'dark', onClick }) {
  return (
    <Link
      to="/"
      className={`${styles.logo} ${tone === 'light' ? styles.light : ''}`}
      aria-label="Alladin Cafe home"
      onClick={onClick}
    >
      <span className={styles.mark} aria-hidden="true">
        <svg viewBox="0 0 40 40" focusable="false">
          <g transform="translate(20 20.4) scale(1.1) translate(-21.3 -21.2)">
            <path
              className={styles.genie}
              d="M11.6 19.2Q16.4 16.2 21.4 19l-.6 5.2q-.4 4.4-4.4 6.4-3.2 1.5-2.2 3.3.9 1.4 4 .6-1.6 1.6-4.2 1.3-3.5-.6-3.2-3.6.3-2.6 3.3-4.4 1.6-1-.4-3.4z"
            />
            <path className={styles.crease} d="M12.6 21.4q2.6 1.4 6.2.2" />
            <circle className={styles.genie} cx="16.4" cy="13.6" r="2.9" />
            <path className={styles.turban} d="M12.3 12.4a4.1 3.6 0 0 1 8.2 0z" />
            <path className={styles.turban} d="M16.4 8.9q.6-1.8 2.3-2.2-.3 1.4-1.1 2.6z" />
            <path className={styles.arm} d="M20.6 19.6q2.8 2.6 6.4.6" />
            <path className={styles.cup} d="M23.6 14.2h6.6v2.4a3.3 3.3 0 0 1-6.6 0z" />
            <path className={styles.line} d="M30.2 15.1h.8a1.6 1.6 0 0 1 0 3.2h-1.2" />
            <path className={styles.line} d="M25.4 12.3c0-1.3 1.3-1.3 1.3-2.6M28.3 12.3c0-1.3 1.3-1.3 1.3-2.6" />
          </g>
        </svg>
      </span>
      <span className={styles.word}>
        Alladin <em>Cafe</em>
      </span>
    </Link>
  );
}

export default Logo;
