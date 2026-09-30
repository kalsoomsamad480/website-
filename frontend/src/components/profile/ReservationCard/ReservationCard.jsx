import { useState } from 'react';
import StatusBadge from '../../common/StatusBadge/StatusBadge';
import { cancelReservation } from '../../../services/reservationService';
import { formatLongDate, toDateString } from '../../../utils/formatDate';
import { formatTime } from '../../../utils/openingHours';
import styles from './ReservationCard.module.css';

const ACTIVE = ['pending', 'approved'];

function ReservationCard({ reservation, onChanged }) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const isUpcoming = reservation.date >= toDateString(new Date());
  const canCancel = ACTIVE.includes(reservation.status) && isUpcoming;

  const handleCancel = async () => {
    setBusy(true);
    setError('');
    try {
      await cancelReservation(reservation._id);
      onChanged();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <li className={`${styles.card} ${isUpcoming ? '' : styles.past}`}>
      <div className={styles.when}>
        <p className={styles.date}>{formatLongDate(reservation.date)}</p>
        <p className={styles.time}>{formatTime(reservation.time)}</p>
      </div>
      <div className={styles.details}>
        <StatusBadge status={reservation.status} />
        <p>
          {reservation.seatType === 'table' ? 'Table' : 'Study desk'}, {reservation.guests}{' '}
          {reservation.guests === 1 ? 'person' : 'people'}
        </p>
        {reservation.notes && <p className={styles.notes}>{reservation.notes}</p>}
      </div>

      {canCancel && (
        <div className={styles.actions}>
          {confirming ? (
            <>
              <span className={styles.question}>Cancel this booking?</span>
              <button
                type="button"
                className={styles.danger}
                onClick={handleCancel}
                disabled={busy}
              >
                {busy ? 'Cancelling...' : 'Yes, cancel'}
              </button>
              <button
                type="button"
                className={styles.link}
                onClick={() => setConfirming(false)}
                disabled={busy}
              >
                Keep it
              </button>
            </>
          ) : (
            <button type="button" className={styles.link} onClick={() => setConfirming(true)}>
              Cancel booking
            </button>
          )}
        </div>
      )}
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </li>
  );
}

export default ReservationCard;
