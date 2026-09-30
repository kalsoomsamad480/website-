import StatusBadge from '../../common/StatusBadge/StatusBadge';
import DataTable from '../DataTable/DataTable';
import formatPrice from '../../../utils/formatPrice';
import { formatDateTime } from '../../../utils/formatDate';
import { ORDER_STATUSES } from '../../../utils/adminConstants';
import styles from './OrdersTable.module.css';

// The usual next step for each status, shown as a one-click button
const NEXT_STEP = {
  pending: { status: 'preparing', label: 'Start preparing' },
  preparing: { status: 'ready', label: 'Mark ready' },
  ready: { status: 'completed', label: 'Complete' },
};

function OrdersTable({ orders, onStatusChange, busyId }) {
  return (
    <DataTable caption="Orders" minWidth={900}>
      <thead>
        <tr>
          <th scope="col">Order</th>
          <th scope="col">Customer</th>
          <th scope="col">Items</th>
          <th scope="col">Total</th>
          <th scope="col">Status</th>
          <th scope="col">
            <span className="visually-hidden">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => {
          const next = NEXT_STEP[order.status];
          const busy = busyId === order._id;
          return (
            <tr key={order._id}>
              <td>
                <strong>{order.orderNumber}</strong>
                <span className={styles.sub}>{formatDateTime(order.createdAt)}</span>
                <span className={styles.sub}>
                  {order.orderType === 'pickup' ? 'Pickup' : 'Dine in'}
                </span>
              </td>
              <td>
                {order.user?.name || 'Guest'}
                <span className={styles.sub}>{order.user?.email}</span>
              </td>
              <td className={styles.items}>
                {order.items.map((item) => `${item.quantity} x ${item.name}`).join(', ')}
                {order.notes && <span className={styles.note}>Note: {order.notes}</span>}
              </td>
              <td>
                <strong>{formatPrice(order.total)}</strong>
                <span className={styles.sub}>{order.paymentMethod}</span>
              </td>
              <td>
                <StatusBadge status={order.status} />
              </td>
              <td>
                <div className={styles.actions}>
                  {next && (
                    <button
                      type="button"
                      className={styles.next}
                      disabled={busy}
                      onClick={() => onStatusChange(order, next.status)}
                    >
                      {next.label}
                    </button>
                  )}
                  <label className="visually-hidden" htmlFor={`status-${order._id}`}>
                    Change status of {order.orderNumber}
                  </label>
                  <select
                    id={`status-${order._id}`}
                    className={styles.select}
                    value={order.status}
                    disabled={busy}
                    onChange={(event) => onStatusChange(order, event.target.value)}
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status[0].toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </DataTable>
  );
}

export default OrdersTable;
