import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import Button from '../../common/Button/Button';
import StatusBadge from '../../common/StatusBadge/StatusBadge';
import useAuth from '../../../hooks/useAuth';
import { formatLongDate } from '../../../utils/formatDate';
import { formatTime } from '../../../utils/openingHours';
import { fadeUp, staggerContainer } from '../../../utils/motionVariants';
import styles from './ReservationSuccess.module.css';

function ReservationSuccess({ reservation, onBookAnother }) {
  const { user } = useAuth();

  return (
    <motion.section
      className={`container ${styles.wrap}`}
      variants={staggerContainer(0.08)}
      initial="hidden"
      animate="visible"
      aria-labelledby="reservation-success-title"
    >
      <motion.span className={styles.check} variants={fadeUp} aria-hidden="true">
        <Check size={32} strokeWidth={3} />
      </motion.span>
      <motion.h1 id="reservation-success-title" variants={fadeUp}>
        Request <em>received</em>.
      </motion.h1>
      <motion.p className="lead" variants={fadeUp}>
        Thanks, {reservation.name.split(' ')[0]}. We will confirm your booking shortly.
      </motion.p>

      <motion.dl className={styles.card} variants={fadeUp}>
        <div>
          <dt>Status</dt>
          <dd>
            <StatusBadge status={reservation.status} />
          </dd>
        </div>
        <div>
          <dt>Seat</dt>
          <dd>{reservation.seatType === 'table' ? 'Table' : 'Study desk'}</dd>
        </div>
        <div>
          <dt>When</dt>
          <dd>
            {formatLongDate(reservation.date)}, {formatTime(reservation.time)}
          </dd>
        </div>
        <div>
          <dt>Guests</dt>
          <dd>{reservation.guests}</dd>
        </div>
        <div>
          <dt>Contact</dt>
          <dd>{reservation.email}</dd>
        </div>
      </motion.dl>

      <motion.div className={styles.actions} variants={fadeUp}>
        {user ? (
          <Button to="/profile?tab=reservations" icon={ArrowRight}>
            See my reservations
          </Button>
        ) : (
          <Button to="/register" icon={ArrowRight}>
            Create an account to track bookings
          </Button>
        )}
        <Button variant="ghost" onClick={onBookAnother}>
          Make another booking
        </Button>
      </motion.div>
    </motion.section>
  );
}

export default ReservationSuccess;
