// Shared Framer Motion variants. Only transform and opacity are animated.

export const EASE_OUT = [0.22, 1, 0.36, 1];
export const EASE_IN = [0.64, 0, 0.78, 0];

export const pageTransition = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE_OUT } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: EASE_IN } },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_OUT, delay },
  }),
};

export const staggerContainer = (stagger = 0.06, delayChildren = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren } },
});

export const menuPanel = {
  hidden: { y: '-100%' },
  visible: { y: 0, transition: { duration: 0.4, ease: EASE_OUT } },
  exit: { y: '-100%', transition: { duration: 0.3, ease: EASE_IN } },
};

export const menuItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT } },
};

export const navPillSpring = { type: 'spring', stiffness: 380, damping: 32 };
