import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import LazyImage from '../../common/LazyImage/LazyImage';
import formatPrice from '../../../utils/formatPrice';
import { EASE_OUT } from '../../../utils/motionVariants';
import styles from './MenuCard.module.css';

/**
 * Menu item card. The title button stretches over the whole card to open details;
 * the optional Add button (Phase 4 cart) sits above that layer.
 */
function MenuCard({ item, onOpen, onAdd }) {
  const isNew = item.tags.includes('new');
  const isVeg = item.tags.includes('veg');

  return (
    <motion.article
      layout
      className={styles.item}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, ease: EASE_OUT }}
    >
      {/* Inner wrapper owns the hover lift, since Framer controls the outer transform */}
      <div className={`${styles.card} ${item.isAvailable ? '' : styles.unavailable}`}>
        <div className={styles.media}>
          <LazyImage src={item.image} alt={item.name} width={640} height={800} />
          {!item.isAvailable && <span className={styles.status}>Sold out today</span>}
          {item.isAvailable && isNew && <span className={styles.badge}>New</span>}
        </div>

        <div className={styles.body}>
          <div className={styles.titleRow}>
            <h3 className={styles.title}>
              <button type="button" className={styles.open} onClick={() => onOpen(item)}>
                {item.name}
              </button>
            </h3>
            <span className={styles.price}>{formatPrice(item.price)}</span>
          </div>
          <p className={styles.description}>{item.description}</p>
          <div className={styles.footer}>
            <span className={styles.meta}>
              {item.category?.name}
              {isVeg && <span className={styles.veg}>Veg</span>}
            </span>
            {onAdd && item.isAvailable && (
              <button
                type="button"
                className={styles.add}
                onClick={() => onAdd(item)}
                aria-label={`Add ${item.name} to cart`}
              >
                <Plus size={18} strokeWidth={2.4} aria-hidden="true" />
                Add
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default MenuCard;
