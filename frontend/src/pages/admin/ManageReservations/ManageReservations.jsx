import { useState } from 'react';
import { RotateCw } from 'lucide-react';
import SEO from '../../../components/common/SEO/SEO';
import Button from '../../../components/common/Button/Button';
import EmptyState from '../../../components/common/EmptyState/EmptyState';
import AdminPageHeader from '../../../components/admin/AdminPageHeader/AdminPageHeader';
import AdminState from '../../../components/admin/AdminState/AdminState';
import FilterChips from '../../../components/admin/FilterChips/FilterChips';
import Panel from '../../../components/admin/Panel/Panel';
import RescheduleModal from '../../../components/admin/RescheduleModal/RescheduleModal';
import ReservationsTable from '../../../components/admin/ReservationsTable/ReservationsTable';
import useAdminData from '../../../hooks/useAdminData';
import useSelection from '../../../hooks/useSelection';
import { getReservations, updateReservationStatus } from '../../../services/adminService';
import { capitalize, RESERVATION_STATUSES } from '../../../utils/adminConstants';
import { toDateString } from '../../../utils/formatDate';
import styles from '../adminPage.module.css';

const LABELS = { approved: 'Confirmed', rejected: 'Declined' };

function ManageReservations() {
  const [date, setDate] = useState('');
  const reservations = useAdminData(() => getReservations(date ? { date } : {}), date);
  const [filter, setFilter] = useState('upcoming');
  const [busyId, setBusyId] = useState(null);
  const [message, setMessage] = useState('');
  const reschedule = useSelection();

  const today = toDateString(new Date());
  const all = reservations.data || [];
  const count = (test) => all.filter(test).length;
  const tests = {
    upcoming: (r) => r.date >= today && ['pending', 'approved'].includes(r.status),
    all: () => true,
    ...Object.fromEntries(RESERVATION_STATUSES.map((s) => [s, (r) => r.status === s])),
  };
  const visible = all.filter(tests[filter]);

  const filters = [
    { value: 'upcoming', label: 'Upcoming', count: count(tests.upcoming) },
    ...RESERVATION_STATUSES.map((s) => ({
      value: s,
      label: LABELS[s] || capitalize(s),
      count: count(tests[s]),
    })),
    { value: 'all', label: 'All', count: all.length },
  ];

  const changeStatus = async (reservation, status) => {
    setBusyId(reservation._id);
    setMessage('');
    try {
      const updated = await updateReservationStatus(reservation._id, status);
      reservations.setData((list) => list.map((r) => (r._id === updated._id ? updated : r)));
      setMessage(
        `Booking for ${reservation.name} is now ${(LABELS[status] || status).toLowerCase()}.`,
      );
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <SEO noIndex title="Reservations" />
      <AdminPageHeader
        title="Reservations"
        description="Approve new requests and keep the day's bookings on track."
        actions={
          <Button
            variant="ghost"
            size="sm"
            icon={RotateCw}
            onClick={reservations.reload}
            disabled={reservations.loading}
          >
            {reservations.loading ? 'Refreshing...' : 'Refresh'}
          </Button>
        }
      />
      <div className={styles.toolbar}>
        <FilterChips
          options={filters}
          value={filter}
          onChange={setFilter}
          label="Filter bookings by status"
        />
        <label className={styles.field}>
          <span className="visually-hidden">Show one date</span>
          <input
            type="date"
            className={styles.input}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
      </div>
      <p className={styles.status} role="status">
        {date ? `Showing ${date} only. ` : ''}
        {message}
      </p>

      <AdminState data={reservations.data} error={reservations.error} onRetry={reservations.reload}>
        {visible.length ? (
          <Panel flush>
            <ReservationsTable
              reservations={visible}
              onStatusChange={changeStatus}
              onReschedule={reschedule.open}
              busyId={busyId}
            />
          </Panel>
        ) : (
          <EmptyState title="No bookings here." text="Try another filter or date." />
        )}
      </AdminState>

      <RescheduleModal
        key={reschedule.selected?._id}
        reservation={reschedule.selected}
        open={reschedule.isOpen}
        onClose={reschedule.close}
        onDone={(updated) => {
          reservations.setData((list) => list.map((r) => (r._id === updated._id ? updated : r)));
          setMessage(`Booking for ${updated.name} moved.`);
          reschedule.close();
        }}
      />
    </>
  );
}

export default ManageReservations;
