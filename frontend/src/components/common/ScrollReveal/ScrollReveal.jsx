import { motion } from 'framer-motion';
import { fadeUp } from '../../../utils/motionVariants';

/** Fades and lifts its children into view once, when they enter the viewport. */
function ScrollReveal({ delay = 0, className, children }) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

export default ScrollReveal;
