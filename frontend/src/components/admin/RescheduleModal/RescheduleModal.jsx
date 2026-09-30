import { useState } from 'react';
import Modal from '../../common/Modal/Modal';
import Button from '../../common/Button/Button';
import { rescheduleReservation } from '../../../services/adminService';
import { getAvailability } from '../../../services/reservationService';
import { formatLongDate, toDateString } from '../../../utils/formatDate';
import { formatTime } from '../../../utils/openingHours';
import styles from './RescheduleModal.module.css';

/** Pick a new date and a free slot for an existing reservation. */
function RescheduleModal({ reservation, open, onClose, onDone }) {
  const [date, setDate] = useState(reservation?.date || toDateString(new Date()));
  const [slots, setSlots] = useState(null);
  const [time, setTime] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadSlots = async (value) => {
    setDate(value);
    setTime('');
    setSlots(null);
    setError('');
    try {
      const result = await getAvailability(value, reservation.seatType);
      setSlots(result.filter((slot) => slot.remaining >= reservation.guests));
    } catch (err) {
      setError(err.message);
    }
  };

  const save = async () => {
    setSaving(true);
    setError('');
    try {
      const updated = await rescheduleReservation(reservation._id, date, time);
      onDone(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} labelledBy="reschedule-title" size="sm">
      {reservation && (
        <div className={styles.body}>
          <h2 id="reschedule-title" className={styles.title}>
            Reschedule <em>booking</em>
          </h2>
          <p className={styles.muted}>
            {reservation.name},{' '}
            {reservation.seatType === 'table' ? `table for ${reservation.guests}` : 'study desk'}.
            Currently {formatLongDate(reservation.date)} at {formatTime(reservation.time)}.
          </p>

          <label className={styles.field}>
            New date
            <input
              type="date"
              className={styles.input}
              value={date}
              min={toDateString(new Date())}
              onChange={(event) => event.target.value && loadSlots(event.target.value)}
            />
          </label>

          {slots === null && !error && (
            <Button variant="ghost" size="sm" onClick={() => loadSlots(date)}>
              Show free times for {formatLongDate(date)}
            </Button>
          )}
          {slots && !slots.length && <p className={styles.muted}>No free times on this date.</p>}
          {slots && slots.length > 0 && (
            <div className={styles.slots} role="radiogroup" aria-label="New time">
              {slots.map((slot) => (
                <button
                  key={slot.time}
                  type="button"
                  role="radio"
                  aria-checked={time === slot.time}
                  className={`${styles.slot} ${time === slot.time ? styles.selected : ''}`}
                  onClick={() => setTime(slot.time)}
                >
                  {formatTime(slot.time)}
                </button>
              ))}
            </div>
          )}

          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
          <Button onClick={save} disabled={!time || saving} fullWidth>
            {saving ? 'Saving...' : time ? `Move to ${formatTime(time)}` : 'Choose a time'}
          </Button>
        </div>
      )}
    </Modal>
  );
}

export default RescheduleModal;
