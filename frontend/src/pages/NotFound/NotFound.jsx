import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import SEO from '../../components/common/SEO/SEO';
import Button from '../../components/common/Button/Button';
import { fadeUp, staggerContainer } from '../../utils/motionVariants';
import styles from './NotFound.module.css';

function NotFound() {
  return (
    <>
      <SEO noIndex title="Page not found" description="This page does not exist at Alladin Cafe." />
      <motion.section
        className={`container ${styles.wrap}`}
        variants={staggerContainer(0.08)}
        initial="hidden"
        animate="visible"
      >
        <motion.p className={styles.code} variants={fadeUp} aria-hidden="true">
          404
        </motion.p>
        <div className={styles.text}>
          <motion.span className="eyebrow" variants={fadeUp}>
            Page not found
          </motion.span>
          <motion.h1 variants={fadeUp}>
            This table is <em>empty</em>.
          </motion.h1>
          <motion.p className="lead" variants={fadeUp}>
            The page you are looking for has moved or never existed. Let us find you a better seat.
          </motion.p>
          <motion.div className={styles.actions} variants={fadeUp}>
            <Button to="/" icon={ArrowRight}>
              Back to home
            </Button>
            <Button to="/menu" variant="ghost">
              See the menu
            </Button>
          </motion.div>
        </div>
      </motion.section>
    </>
  );
}

export default NotFound;
