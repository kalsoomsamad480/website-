import { Link } from 'react-router-dom';
import { RotateCw } from 'lucide-react';
import SEO from '../../../components/common/SEO/SEO';
import Button from '../../../components/common/Button/Button';
import StatusBadge from '../../../components/common/StatusBadge/StatusBadge';
import AdminPageHeader from '../../../components/admin/AdminPageHeader/AdminPageHeader';
import AdminState from '../../../components/admin/AdminState/AdminState';
import DataTable from '../../../components/admin/DataTable/DataTable';
import Panel from '../../../components/admin/Panel/Panel';
import RevenueChart from '../../../components/admin/RevenueChart/RevenueChart';
import StatCard from '../../../components/admin/StatCard/StatCard';
import useAdminData from '../../../hooks/useAdminData';
import { getStats } from '../../../services/adminService';
import formatPrice from '../../../utils/formatPrice';
import { formatDateTime, formatLongDate } from '../../../utils/formatDate';
import { formatTime } from '../../../utils/openingHours';
import styles from './Dashboard.module.css';

const plural = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`;
const today = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

function Dashboard() {
  const stats = useAdminData(getStats);
  const s = stats.data;
  const topQuantity = s ? Math.max(1, ...s.popularItems.map((item) => item.quantity)) : 1;

  return (
    <>
      <SEO noIndex title="Admin dashboard" />
      <AdminPageHeader
        title="Dashboard"
        description={today.format(new Date())}
        actions={
          <Button
            variant="ghost"
            size="sm"
            icon={RotateCw}
            onClick={stats.reload}
            disabled={stats.loading}
          >
            {stats.loading ? 'Refreshing...' : 'Refresh'}
          </Button>
        }
      />

      <AdminState data={s} error={stats.error} onRetry={stats.reload}>
        {s && (
          <div className={styles.grid}>
            <div className={styles.stats}>
              <StatCard
                label="Orders today"
                value={s.today.orders}
                note={`${s.week.orders} this week`}
                to="/admin/orders"
              />
              <StatCard
                label="Revenue today"
                value={formatPrice(s.today.revenue)}
                note={`${formatPrice(s.week.revenue)} this week`}
              />
              <StatCard
                label="Bookings today"
                value={s.today.reservations}
                note="Tables and study desks"
                to="/admin/reservations"
              />
              <StatCard
                label="Needs attention"
                value={s.pending.orders + s.pending.reservations + s.pending.messages}
                note={`${plural(s.pending.orders, 'order')}, ${plural(s.pending.reservations, 'booking')}, ${plural(s.pending.messages, 'message')}`}
                highlight={s.pending.orders + s.pending.reservations + s.pending.messages > 0}
              />
            </div>

            <Panel title="Revenue, last 7 days" className={styles.chart}>
              <RevenueChart days={s.week.byDay} />
            </Panel>

            <Panel title="Popular this month" className={styles.popular}>
              {s.popularItems.length ? (
                <ol className={styles.popularList}>
                  {s.popularItems.map((item) => (
                    <li key={item.name}>
                      <div className={styles.popularRow}>
                        <span className={styles.popularName}>{item.name}</span>
                        <span className={styles.popularCount}>{item.quantity} sold</span>
                      </div>
                      <span className={styles.meter} aria-hidden="true">
                        <span style={{ transform: `scaleX(${item.quantity / topQuantity})` }} />
                      </span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className={styles.muted}>No orders in the last 30 days yet.</p>
              )}
              <p className={styles.muted}>
                {s.menu.total} menu items, {s.menu.unavailable} sold out today.{' '}
                <Link to="/admin/menu" className={styles.inlineLink}>
                  Manage menu
                </Link>
              </p>
            </Panel>

            <Panel
              title="Recent orders"
              actions={
                <Link to="/admin/orders" className={styles.inlineLink}>
                  All orders
                </Link>
              }
              flush
              className={styles.orders}
            >
              <DataTable caption="Recent orders" minWidth={520}>
                <thead>
                  <tr>
                    <th scope="col">Order</th>
                    <th scope="col">Customer</th>
                    <th scope="col">Total</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {s.recentOrders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <strong>{order.orderNumber}</strong>
                        <br />
                        <span className={styles.muted}>{formatDateTime(order.createdAt)}</span>
                      </td>
                      <td>{order.user?.name || 'Guest'}</td>
                      <td>{formatPrice(order.total)}</td>
                      <td>
                        <StatusBadge status={order.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </DataTable>
            </Panel>

            <Panel
              title="Upcoming bookings"
              actions={
                <Link to="/admin/reservations" className={styles.inlineLink}>
                  All bookings
                </Link>
              }
              className={styles.bookings}
            >
              {s.upcomingReservations.length ? (
                <ul className={styles.bookingList}>
                  {s.upcomingReservations.map((r) => (
                    <li key={r._id} className={styles.booking}>
                      <div>
                        <p className={styles.bookingWhen}>
                          {formatLongDate(r.date)}, {formatTime(r.time)}
                        </p>
                        <p className={styles.muted}>
                          {r.name},{' '}
                          {r.seatType === 'table' ? `table for ${r.guests}` : 'study desk'}
                        </p>
                      </div>
                      <StatusBadge status={r.status} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.muted}>No upcoming bookings.</p>
              )}
            </Panel>
          </div>
        )}
      </AdminState>
    </>
  );
}

export default Dashboard;
