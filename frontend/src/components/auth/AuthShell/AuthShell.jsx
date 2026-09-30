import { motion } from 'framer-motion';
import LazyImage from '../../common/LazyImage/LazyImage';
import { fadeUp, staggerContainer } from '../../../utils/motionVariants';
import styles from './AuthShell.module.css';

/** Split layout for sign-in and registration: photo on one side, form card on the other. */
function AuthShell({ eyebrow, title, intro, children }) {
  return (
    <section className={`container ${styles.shell}`}>
      <div className={styles.visual}>
        <LazyImage
          src="/images/gallery/window-seats.webp"
          alt="Window seats at Alladin Cafe with laptops and morning light"
          width={1200}
          height={900}
          priority
        />
        <p className={styles.quote}>
          &ldquo;The quiet room saved my exam season.&rdquo;
          <span>Zara, medical student</span>
        </p>
      </div>

      <motion.div
        className={styles.card}
        variants={staggerContainer(0.08)}
        initial="hidden"
        animate="visible"
      >
        <motion.span className="eyebrow" variants={fadeUp}>
          {eyebrow}
        </motion.span>
        <motion.h1 className={styles.title} variants={fadeUp}>
          {title}
        </motion.h1>
        {intro && (
          <motion.p className={styles.intro} variants={fadeUp}>
            {intro}
          </motion.p>
        )}
        <motion.div variants={fadeUp}>{children}</motion.div>
      </motion.div>
    </section>
  );
}

export default AuthShell;
