import { AnimatePresence, motion } from 'framer-motion';
import MenuCard from '../MenuCard/MenuCard';
import Skeleton from '../../common/Skeleton/Skeleton';
import styles from './MenuGrid.module.css';

function MenuGrid({ items, onOpen, onAdd, columns }) {
  return (
    <motion.div layout className={`${styles.grid} ${columns === 3 ? styles.three : ''}`}>
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <MenuCard key={item._id} item={item} onOpen={onOpen} onAdd={onAdd} />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

export function MenuGridSkeleton({ count = 6, columns }) {
  return (
    <div
      className={`${styles.grid} ${columns === 3 ? styles.three : ''}`}
      aria-busy="true"
      aria-label="Loading menu"
    >
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className={styles.skeletonCard}>
          <Skeleton height="auto" radius="0" className={styles.skeletonImage} />
          <div className={styles.skeletonBody}>
            <Skeleton width="70%" height={20} />
            <Skeleton height={14} />
            <Skeleton width="50%" height={14} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default MenuGrid;
