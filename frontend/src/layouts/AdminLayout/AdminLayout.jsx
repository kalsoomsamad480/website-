import { Suspense, useState } from 'react';
import { useLocation, useNavigate, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar/AdminSidebar';
import Logo from '../../components/common/Logo/Logo';
import Loader from '../../components/common/Loader/Loader';
import useAuth from '../../hooks/useAuth';
import useLockBodyScroll from '../../hooks/useLockBodyScroll';
import styles from './AdminLayout.module.css';

function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const outlet = useOutlet();
  const [menuOpen, setMenuOpen] = useState(false);
  useLockBodyScroll(menuOpen);

  const signOut = async () => {
    navigate('/', { replace: true });
    await logout();
  };

  return (
    <div className={styles.shell}>
      <a href="#admin-main" className="skip-link">
        Skip to content
      </a>

      {/* Phones: top bar with a drawer; desktop: fixed sidebar */}
      <header className={`${styles.topbar} on-dark`}>
        <Logo tone="light" />
        <button
          type="button"
          className={styles.menuButton}
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close admin menu' : 'Open admin menu'}
        >
          {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </header>

      <aside className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ''}`}>
        <AdminSidebar user={user} onNavigate={() => setMenuOpen(false)} onSignOut={signOut} />
      </aside>
      {menuOpen && (
        <div className={styles.scrim} onClick={() => setMenuOpen(false)} aria-hidden="true" />
      )}

      <main id="admin-main" className={styles.main} tabIndex={-1}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.25 } }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
          >
            <Suspense fallback={<Loader fullPage />}>{outlet}</Suspense>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default AdminLayout;
