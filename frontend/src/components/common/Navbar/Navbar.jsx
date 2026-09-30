import { useCallback, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, ShoppingBag, UserRound } from 'lucide-react';
import Logo from '../Logo/Logo';
import Button from '../Button/Button';
import OpenStatus from '../OpenStatus/OpenStatus';
import MobileMenu from '../MobileMenu/MobileMenu';
import useScrollPosition from '../../../hooks/useScrollPosition';
import useCart from '../../../hooks/useCart';
import useAuth from '../../../hooks/useAuth';
import { NAV_LINKS } from '../../../utils/constants';
import { navPillSpring } from '../../../utils/motionVariants';
import styles from './Navbar.module.css';

function Navbar() {
  const scrolled = useScrollPosition(16);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const { count, openCart } = useCart();
  const { user } = useAuth();

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        <Logo />

        <nav className={styles.nav} aria-label="Main">
          <ul className={styles.links}>
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} end={link.to === '/'} className={styles.link}>
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.span
                          layoutId="nav-active-pill"
                          className={styles.pill}
                          transition={navPillSpring}
                        />
                      )}
                      <span className={`${styles.linkText} ${isActive ? styles.activeText : ''}`}>
                        {link.label}
                      </span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <OpenStatus className={styles.status} />

          <Link
            to={user ? (user.role === 'admin' ? '/admin' : '/profile') : '/login'}
            className={`${styles.iconButton} ${styles.account}`}
            aria-label={user ? `Your account, ${user.name}` : 'Sign in'}
          >
            <UserRound size={20} strokeWidth={2} aria-hidden="true" />
          </Link>

          <button
            type="button"
            className={`${styles.iconButton} ${styles.cart}`}
            onClick={openCart}
            aria-label={`Open cart, ${count} ${count === 1 ? 'item' : 'items'}`}
          >
            <ShoppingBag size={20} strokeWidth={2} aria-hidden="true" />
            {count > 0 && (
              <motion.span
                key={count}
                className={styles.badge}
                initial={{ scale: 0.6 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                aria-hidden="true"
              >
                {count > 99 ? '99+' : count}
              </motion.span>
            )}
          </button>

          <Button to="/reserve" size="sm" className={styles.reserve}>
            Reserve
          </Button>

          <button
            ref={menuButtonRef}
            type="button"
            className={`${styles.iconButton} ${styles.menuButton}`}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={22} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
      </div>

      <MobileMenu open={menuOpen} onClose={closeMenu} />
    </header>
  );
}

export default Navbar;
