import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from '../../common/Button/Button';
import DataBoundary from '../../common/DataBoundary/DataBoundary';
import FormField from '../../common/FormField/FormField';
import QuantityStepper from '../../common/QuantityStepper/QuantityStepper';
import SegmentedControl from '../../common/SegmentedControl/SegmentedControl';
import Skeleton from '../../common/Skeleton/Skeleton';
import DatePicker from '../DatePicker/DatePicker';
import TimeSlotPicker from '../TimeSlotPicker/TimeSlotPicker';
import useAuth from '../../../hooks/useAuth';
import useForm from '../../../hooks/useForm';
import { createReservation, getAvailability } from '../../../services/reservationService';
import { formatLongDate, upcomingDates } from '../../../utils/formatDate';
import { formatTime } from '../../../utils/openingHours';
import { compactErrors, isEmail, isPhone } from '../../../utils/validators';
import styles from './ReservationForm.module.css';

const SEAT_OPTIONS = [
  { value: 'table', label: 'Table' },
  { value: 'study-desk', label: 'Study desk' },
];
const BOOKING_DAYS = 30;

/** Seat type, date, time, guests, and contact details, with a live summary. */
function ReservationForm({ onBooked }) {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const [dates] = useState(() => upcomingDates(BOOKING_DAYS));

  const [seatType, setSeatType] = useState(
    params.get('seat') === 'study-desk' ? 'study-desk' : 'table',
  );
  const [date, setDate] = useState(dates[0]);
  const [time, setTime] = useState(null);
  const [guests, setGuests] = useState(seatType === 'table' ? 2 : 1);
  const [slotsPromise, setSlotsPromise] = useState(() => getAvailability(dates[0], seatType));
  const [submitting, setSubmitting] = useState(false);
  const form = useForm({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    notes: '',
  });

  const reloadSlots = (nextDate = date, nextSeat = seatType) => {
    setSlotsPromise(getAvailability(nextDate, nextSeat));
    setTime(null);
  };

  const changeSeat = (value) => {
    setSeatType(value);
    setGuests(value === 'study-desk' ? 1 : Math.max(guests, 2));
    reloadSlots(date, value);
  };

  const changeDate = (value) => {
    setDate(value);
    reloadSlots(value, seatType);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { name, email, phone } = form.values;
    const found = compactErrors({
      time: time ? '' : 'Please choose a time.',
      name: name.trim().length >= 2 ? '' : 'Please enter your name.',
      email: isEmail(email) ? '' : 'Enter a valid email address.',
      phone: isPhone(phone) ? '' : 'Enter a phone number so we can reach you.',
    });
    form.setErrors(found);
    form.setFormError('');
    if (Object.keys(found).length) return;

    setSubmitting(true);
    try {
      const reservation = await createReservation({
        ...form.values,
        name: name.trim(),
        notes: form.values.notes.trim(),
        date,
        time,
        guests,
        seatType,
      });
      onBooked(reservation);
    } catch (error) {
      form.applyServerError(error);
      // Someone may have taken the slot: show fresh availability
      if (error.fieldErrors.some((item) => item.field === 'time')) reloadSlots();
      setSubmitting(false);
    }
  };

  return (
    <form className={styles.layout} onSubmit={handleSubmit} noValidate>
      <div className={styles.steps}>
        <fieldset className={styles.step}>
          <legend className={styles.stepTitle}>
            <span className={styles.stepNumber}>Step 1</span>
            What would you like to book?
          </legend>
          <SegmentedControl
            options={SEAT_OPTIONS}
            value={seatType}
            onChange={changeSeat}
            label="Seat type"
          />
          <p className={styles.hint}>
            {seatType === 'table'
              ? 'Tables seat 1 to 8 guests in our social area.'
              : 'A single desk in the Quiet Room or Focus Bar, with power and fast Wi-Fi.'}
          </p>
        </fieldset>

        <fieldset className={styles.step}>
          <legend className={styles.stepTitle}>
            <span className={styles.stepNumber}>Step 2</span>
            Pick a day
          </legend>
          <DatePicker dates={dates} value={date} onChange={changeDate} />
        </fieldset>

        <fieldset className={styles.step}>
          <legend className={styles.stepTitle}>
            <span className={styles.stepNumber}>Step 3</span>
            {seatType === 'table' ? 'Guests and time' : 'Pick a time'}
          </legend>
          {seatType === 'table' && (
            <div className={styles.guests}>
              <span className={styles.guestsLabel}>Guests</span>
              <QuantityStepper
                value={guests}
                onChange={setGuests}
                min={1}
                max={8}
                label="guests"
                size="lg"
              />
            </div>
          )}
          <DataBoundary
            fallback={<Skeleton height={160} radius="var(--radius-md)" />}
            errorTitle="Times did not load."
            onRetry={() => reloadSlots()}
          >
            <TimeSlotPicker
              slotsPromise={slotsPromise}
              guests={guests}
              value={time}
              onChange={setTime}
            />
          </DataBoundary>
          {form.errors.time && (
            <p className={styles.fieldError} role="alert">
              {form.errors.time}
            </p>
          )}
        </fieldset>

        <fieldset className={styles.step}>
          <legend className={styles.stepTitle}>
            <span className={styles.stepNumber}>Step 4</span>
            Your details
          </legend>
          <FormField label="Full name" autoComplete="name" {...form.field('name')} />
          <div className={styles.row}>
            <FormField label="Email" type="email" autoComplete="email" {...form.field('email')} />
            <FormField label="Phone" type="tel" autoComplete="tel" {...form.field('phone')} />
          </div>
          <FormField
            as="textarea"
            label="Anything we should know?"
            optional
            maxLength={300}
            placeholder="Birthday, high chair, a quiet corner..."
            {...form.field('notes')}
          />
        </fieldset>
      </div>

      <aside className={styles.sidebar} aria-label="Booking summary">
        <div className={styles.summary}>
          <h2 className={styles.summaryTitle}>
            Your <em>booking</em>
          </h2>
          <dl className={styles.details}>
            <div>
              <dt>Seat</dt>
              <dd>{seatType === 'table' ? 'Table' : 'Study desk'}</dd>
            </div>
            <div>
              <dt>Date</dt>
              <dd>{formatLongDate(date)}</dd>
            </div>
            <div>
              <dt>Time</dt>
              <dd>{time ? formatTime(time) : 'Choose a time'}</dd>
            </div>
            <div>
              <dt>Guests</dt>
              <dd>
                {guests} {guests === 1 ? 'person' : 'people'}
              </dd>
            </div>
          </dl>
          {form.formError && (
            <p className={styles.formError} role="alert">
              {form.formError}
            </p>
          )}
          <Button type="submit" size="lg" icon={ArrowRight} fullWidth disabled={submitting}>
            {submitting ? 'Booking...' : 'Request booking'}
          </Button>
          <p className={styles.small}>Free to book. We confirm most requests within the hour.</p>
        </div>
      </aside>
    </form>
  );
}

export default ReservationForm;
