import StatusBadge from '../../common/StatusBadge/StatusBadge';
import DataTable from '../DataTable/DataTable';
import { formatLongDate } from '../../../utils/formatDate';
import { formatTime } from '../../../utils/openingHours';
import styles from '../OrdersTable/OrdersTable.module.css';

function ReservationsTable({ reservations, onStatusChange, onReschedule, busyId }) {
  return (
    <DataTable caption="Reservations" minWidth={900}>
      <thead>
        <tr>
          <th scope="col">When</th>
          <th scope="col">Guest</th>
          <th scope="col">Booking</th>
          <th scope="col">Status</th>
          <th scope="col">
            <span className="visually-hidden">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {reservations.map((r) => {
          const busy = busyId === r._id;
          const active = r.status === 'pending' || r.status === 'approved';
          return (
            <tr key={r._id}>
              <td>
                <strong>{formatLongDate(r.date)}</strong>
                <span className={styles.sub}>{formatTime(r.time)}</span>
              </td>
              <td>
                {r.name}
                <span className={styles.sub} style={{ textTransform: 'none' }}>
                  {r.email}
                </span>
                <span className={styles.sub}>{r.phone}</span>
              </td>
              <td className={styles.items}>
                {r.seatType === 'table' ? `Table for ${r.guests}` : 'Study desk'}
                {r.source === 'agent' && <span className={styles.sub}>Booked via assistant</span>}
                {r.notes && <span className={styles.note}>Note: {r.notes}</span>}
              </td>
              <td>
                <StatusBadge status={r.status} />
              </td>
              <td>
                <div className={styles.actions}>
                  {r.status === 'pending' && (
                    <>
                      <button
                        type="button"
                        className={styles.next}
                        disabled={busy}
                        onClick={() => onStatusChange(r, 'approved')}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        className={styles.select}
                        disabled={busy}
                        onClick={() => onStatusChange(r, 'rejected')}
                      >
                        Decline
                      </button>
                    </>
                  )}
                  {active && (
                    <button
                      type="button"
                      className={styles.select}
                      disabled={busy}
                      onClick={() => onReschedule(r)}
                    >
                      Reschedule
                    </button>
                  )}
                  {r.status === 'approved' && (
                    <button
                      type="button"
                      className={styles.select}
                      disabled={busy}
                      onClick={() => onStatusChange(r, 'cancelled')}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </DataTable>
  );
}

export default ReservationsTable;
