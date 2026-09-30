import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '../../../utils/motionVariants';
import styles from './PageHeader.module.css';

/** Top-of-page intro: eyebrow and title on the left, intro text offset to the right. */
function PageHeader({ eyebrow, title, intro, children }) {
  return (
    <motion.header
      className={`container ${styles.header}`}
      variants={staggerContainer(0.08)}
      initial="hidden"
      animate="visible"
    >
      <div className={styles.titleBlock}>
        {eyebrow && (
          <motion.span className="eyebrow" variants={fadeUp}>
            {eyebrow}
          </motion.span>
        )}
        <motion.h1 className={styles.title} variants={fadeUp}>
          {title}
        </motion.h1>
      </div>
      {(intro || children) && (
        <motion.div className={styles.side} variants={fadeUp}>
          {intro && <p className="lead">{intro}</p>}
          {children}
        </motion.div>
      )}
    </motion.header>
  );
}

export default PageHeader;
