import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import SEO from '../../components/common/SEO/SEO';
import PageHeader from '../../components/common/PageHeader/PageHeader';
import Button from '../../components/common/Button/Button';
import DataBoundary from '../../components/common/DataBoundary/DataBoundary';
import SegmentedControl from '../../components/common/SegmentedControl/SegmentedControl';
import Skeleton from '../../components/common/Skeleton/Skeleton';
import OrderHistory from '../../components/profile/OrderHistory/OrderHistory';
import MyReservations from '../../components/profile/MyReservations/MyReservations';
import ProfileForm from '../../components/profile/ProfileForm/ProfileForm';
import useAuth from '../../hooks/useAuth';
import { getMyOrders } from '../../services/orderService';
import { getMyReservations } from '../../services/reservationService';
import styles from './Profile.module.css';

const TABS = [
  { value: 'orders', label: 'Orders' },
  { value: 'reservations', label: 'Reservations' },
  { value: 'details', label: 'Details' },
];

const listSkeleton = <Skeleton height={180} radius="var(--radius-md)" />;

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const tab = TABS.some((t) => t.value === params.get('tab')) ? params.get('tab') : 'orders';

  // Fresh data on every visit; recreated to refresh after changes
  const [ordersPromise, setOrdersPromise] = useState(() => getMyOrders());
  const [reservationsPromise, setReservationsPromise] = useState(() => getMyReservations());

  const handleLogout = async () => {
    navigate('/', { replace: true });
    await logout();
  };

  return (
    <>
      <SEO noIndex title="Profile" description="Your Alladin Cafe orders, reservations, and saved details." />
      <PageHeader
        eyebrow="Your account"
        title={
          <>
            Hi, <em>{user.name.split(' ')[0]}</em>.
          </>
        }
        intro={`Signed in as ${user.email}.`}
      >
        <Button variant="ghost" icon={LogOut} onClick={handleLogout}>
          Sign out
        </Button>
      </PageHeader>

      <section className={`container ${styles.content}`}>
        <div className={styles.tabs}>
          <SegmentedControl
            options={TABS}
            value={tab}
            onChange={(value) => setParams({ tab: value }, { replace: true })}
            label="Account sections"
          />
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {tab === 'orders' && (
              <DataBoundary
                fallback={listSkeleton}
                errorTitle="Your orders did not load."
                onRetry={() => setOrdersPromise(getMyOrders())}
              >
                <OrderHistory ordersPromise={ordersPromise} />
              </DataBoundary>
            )}
            {tab === 'reservations' && (
              <DataBoundary
                fallback={listSkeleton}
                errorTitle="Your reservations did not load."
                onRetry={() => setReservationsPromise(getMyReservations())}
              >
                <MyReservations
                  reservationsPromise={reservationsPromise}
                  onChanged={() => setReservationsPromise(getMyReservations())}
                />
              </DataBoundary>
            )}
            {tab === 'details' && <ProfileForm />}
          </motion.div>
        </AnimatePresence>
      </section>
    </>
  );
}

export default Profile;
