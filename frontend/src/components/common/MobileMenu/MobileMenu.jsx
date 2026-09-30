import { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import Logo from '../Logo/Logo';
import Button from '../Button/Button';
import OpenStatus from '../OpenStatus/OpenStatus';
import useLockBodyScroll from '../../../hooks/useLockBodyScroll';
import useFocusTrap from '../../../hooks/useFocusTrap';
import useAuth from '../../../hooks/useAuth';
import { CAFE_INFO, NAV_LINKS } from '../../../utils/constants';
import { menuItem, menuPanel, staggerContainer } from '../../../utils/motionVariants';
import styles from './MobileMenu.module.css';

function MobileMenu({ open, onClose }) {
  const panelRef = useRef(null);
  const { user } = useAuth();
  useLockBodyScroll(open);
  useFocusTrap(panelRef, open, onClose);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          id="mobile-menu"
          className={`${styles.panel} on-dark`}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          variants={menuPanel}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className={`container ${styles.top}`}>
            <Logo tone="light" onClick={onClose} />
            <button
              type="button"
              className={styles.close}
              aria-label="Close menu"
              onClick={onClose}
            >
              <X size={24} strokeWidth={2} aria-hidden="true" />
            </button>
          </div>

          <motion.nav
            className={`container ${styles.nav}`}
            aria-label="Mobile"
            variants={staggerContainer(0.05, 0.15)}
            initial="hidden"
            animate="visible"
          >
            <ul className={styles.links}>
              {NAV_LINKS.map((link) => (
                <motion.li key={link.to} variants={menuItem}>
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
                    onClick={onClose}
                  >
                    {link.label}
                  </NavLink>
                </motion.li>
              ))}
            </ul>
          </motion.nav>

          <div className={`container ${styles.bottom}`}>
            <OpenStatus tone="light" />
            <address className={styles.address}>
              {CAFE_INFO.address.join(', ')}
              <br />
              <a href={`tel:${CAFE_INFO.phone.replace(/\s/g, '')}`}>{CAFE_INFO.phone}</a>
            </address>
            <NavLink
              to={user ? (user.role === 'admin' ? '/admin' : '/profile') : '/login'}
              className={styles.account}
              onClick={onClose}
            >
              {user ? `My account (${user.name.split(' ')[0]})` : 'Sign in or create an account'}
            </NavLink>
            <Button
              to="/reserve"
              variant="accent"
              size="lg"
              icon={ArrowRight}
              fullWidth
              onClick={onClose}
            >
              Reserve a seat
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default MobileMenu;
