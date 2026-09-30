import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Button from '../../common/Button/Button';
import ErrorBoundary from '../../common/ErrorBoundary/ErrorBoundary';
import HeroPick from '../HeroPick/HeroPick';
import { EASE_OUT, fadeUp, staggerContainer } from '../../../utils/motionVariants';
import styles from './Hero.module.css';

const STATS = [
  { value: '36', label: 'dishes and drinks made in-house' },
  { value: '54', label: 'seats across three zones' },
  { value: '300', label: 'Mbps Wi-Fi at every table' },
];

function Hero() {
  return (
    <section className={`container ${styles.hero}`} aria-labelledby="hero-title">
      <motion.div
        className={styles.text}
        variants={staggerContainer(0.1, 0.05)}
        initial="hidden"
        animate="visible"
      >
        <motion.span className="eyebrow" variants={fadeUp}>
          Neighborhood cafe and study space
        </motion.span>
        <motion.h1 id="hero-title" className={`display ${styles.headline}`} variants={fadeUp}>
          Good coffee. <em>Quiet</em> minds.
        </motion.h1>
        <motion.p className={`lead ${styles.lead}`} variants={fadeUp}>
          Slow-brewed coffee, fresh bakes, and a calm corner with fast Wi-Fi. Order ahead, or save a
          seat for your next deep-work session.
        </motion.p>
        <motion.div className={styles.actions} variants={fadeUp}>
          <Button to="/menu" size="lg" icon={ArrowRight}>
            Order now
          </Button>
          <Button to="/reserve" variant="ghost" size="lg">
            Reserve a seat
          </Button>
        </motion.div>
        <motion.ul className={styles.stats} variants={fadeUp}>
          {STATS.map((stat) => (
            <li key={stat.label}>
              <strong className={styles.statValue}>{stat.value}</strong>
              <span className={styles.statLabel}>{stat.label}</span>
            </li>
          ))}
        </motion.ul>
      </motion.div>

      <div className={styles.visual}>
        <div className={styles.frame}>
          <motion.img
            src="/images/hero/hero.webp"
            alt="A freshly made coffee on a cafe table in soft morning light"
            width={1200}
            height={1500}
            fetchPriority="high"
            className={styles.image}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.6, ease: EASE_OUT }}
          />
        </div>
        {/* The pick is a bonus: if the menu fails to load, the hero simply hides it */}
        <ErrorBoundary fallback={() => null}>
          <Suspense fallback={null}>
            <HeroPick className={styles.pick} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </section>
  );
}

export default Hero;
