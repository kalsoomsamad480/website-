import { use } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { getMenu } from '../../../services/menuService';
import formatPrice from '../../../utils/formatPrice';
import dailyPick from '../../../utils/dailyPick';
import { EASE_OUT } from '../../../utils/motionVariants';
import styles from './HeroPick.module.css';

/** Floating "Today's pick" card on the hero, chosen daily from popular items. */
function HeroPick({ className = '' }) {
  const items = use(getMenu());
  const pick = dailyPick(items.filter((item) => item.tags.includes('popular') && item.isAvailable));
  if (!pick) return null;

  return (
    <motion.div
      className={`${styles.pick} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.5, ease: EASE_OUT }}
    >
      <Link to={`/menu?search=${encodeURIComponent(pick.name)}`} className={styles.link}>
        <img src={pick.image} alt="" width={64} height={64} className={styles.thumb} />
        <span className={styles.text}>
          <span className={styles.label}>Today&apos;s pick</span>
          <span className={styles.name}>{pick.name}</span>
          <span className={styles.price}>{formatPrice(pick.price)}</span>
        </span>
        <ArrowUpRight className={styles.arrow} size={20} aria-hidden="true" />
      </Link>
    </motion.div>
  );
}

export default HeroPick;
