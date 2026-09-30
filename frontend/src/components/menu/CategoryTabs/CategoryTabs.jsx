import { motion } from 'framer-motion';
import { navPillSpring } from '../../../utils/motionVariants';
import styles from './CategoryTabs.module.css';

/** Category filter buttons. `categories` = [{ slug, name, count }], including "all". */
function CategoryTabs({ categories, active, onChange }) {
  return (
    <div className={styles.scroller}>
      <ul className={styles.list} aria-label="Menu categories">
        {categories.map((category) => {
          const isActive = category.slug === active;
          return (
            <li key={category.slug}>
              <button
                type="button"
                className={`${styles.tab} ${isActive ? styles.active : ''}`}
                aria-pressed={isActive}
                onClick={() => onChange(category.slug)}
              >
                {isActive && (
                  <motion.span
                    layoutId="menu-category-pill"
                    className={styles.pill}
                    transition={navPillSpring}
                  />
                )}
                <span className={styles.label}>
                  {category.name}
                  <span className={styles.count}>{category.count}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default CategoryTabs;
