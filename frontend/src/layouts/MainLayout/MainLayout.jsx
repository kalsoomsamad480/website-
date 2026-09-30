import { Suspense } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '../../components/common/Navbar/Navbar';
import Footer from '../../components/common/Footer/Footer';
import Loader from '../../components/common/Loader/Loader';
import CartDrawer from '../../components/cart/CartDrawer/CartDrawer';
import CartToast from '../../components/cart/CartToast/CartToast';
import ChatWidget from '../../components/chat/ChatWidget/ChatWidget';
import FlashNotice from '../../components/common/FlashNotice/FlashNotice';
import { pageTransition } from '../../utils/motionVariants';
import styles from './MainLayout.module.css';

function MainLayout() {
  const location = useLocation();
  const outlet = useOutlet();

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Navbar />
      <main id="main" className={styles.main} tabIndex={-1}>
        <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
          <motion.div
            key={location.pathname}
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Suspense fallback={<Loader fullPage />}>{outlet}</Suspense>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <CartDrawer />
      <CartToast />
      <ChatWidget />
      <FlashNotice />
    </>
  );
}

export default MainLayout;
