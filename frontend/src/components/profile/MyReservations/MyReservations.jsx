import { use } from 'react';
import { ArrowRight } from 'lucide-react';
import Button from '../../common/Button/Button';
import EmptyState from '../../common/EmptyState/EmptyState';
import ReservationCard from '../ReservationCard/ReservationCard';
import { toDateString } from '../../../utils/formatDate';
import styles from './MyReservations.module.css';

function MyReservations({ reservationsPromise, onChanged }) {
  const reservations = use(reservationsPromise);
  const today = toDateString(new Date());

  if (!reservations.length) {
    return (
      <EmptyState
        title="No reservations yet."
        text="Book a table or a quiet study desk in under a minute."
        action={
          <Button to="/reserve" icon={ArrowRight}>
            Make a reservation
          </Button>
        }
      />
    );
  }

  // Upcoming first (soonest at the top), then past bookings
  const upcoming = reservations
    .filter((r) => r.date >= today)
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  const past = reservations.filter((r) => r.date < today);

  return (
    <div className={styles.groups}>
      {[
        { title: 'Upcoming', items: upcoming },
        { title: 'Past', items: past },
      ]
        .filter((group) => group.items.length)
        .map((group) => (
          <section
            key={group.title}
            className={styles.group}
            aria-label={`${group.title} reservations`}
          >
            <h3 className={styles.groupTitle}>{group.title}</h3>
            <ul className={styles.list}>
              {group.items.map((reservation) => (
                <ReservationCard
                  key={reservation._id}
                  reservation={reservation}
                  onChanged={onChanged}
                />
              ))}
            </ul>
          </section>
        ))}
    </div>
  );
}

export default MyReservations;
