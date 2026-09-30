import { useState } from 'react';
import { RotateCw } from 'lucide-react';
import SEO from '../../../components/common/SEO/SEO';
import Button from '../../../components/common/Button/Button';
import EmptyState from '../../../components/common/EmptyState/EmptyState';
import AdminPageHeader from '../../../components/admin/AdminPageHeader/AdminPageHeader';
import AdminState from '../../../components/admin/AdminState/AdminState';
import FilterChips from '../../../components/admin/FilterChips/FilterChips';
import OrdersTable from '../../../components/admin/OrdersTable/OrdersTable';
import { ORDER_STATUSES } from '../../../utils/adminConstants';
import Panel from '../../../components/admin/Panel/Panel';
import useAdminData from '../../../hooks/useAdminData';
import { getOrders, updateOrderStatus } from '../../../services/adminService';
import styles from '../adminPage.module.css';

function ManageOrders() {
  const orders = useAdminData(() => getOrders());
  const [filter, setFilter] = useState('active');
  const [busyId, setBusyId] = useState(null);
  const [message, setMessage] = useState('');

  const all = orders.data || [];
  const counts = Object.fromEntries(
    ORDER_STATUSES.map((s) => [s, all.filter((o) => o.status === s).length]),
  );
  const activeCount = counts.pending + counts.preparing + counts.ready;
  const visible = all.filter((order) => {
    if (filter === 'all') return true;
    if (filter === 'active') return ['pending', 'preparing', 'ready'].includes(order.status);
    return order.status === filter;
  });

  const changeStatus = async (order, status) => {
    if (status === order.status) return;
    setBusyId(order._id);
    setMessage('');
    const previous = order.status;
    // Optimistic update, reverted if the request fails
    orders.setData((list) => list.map((o) => (o._id === order._id ? { ...o, status } : o)));
    try {
      await updateOrderStatus(order._id, status);
      setMessage(`${order.orderNumber} is now ${status}.`);
    } catch (error) {
      orders.setData((list) =>
        list.map((o) => (o._id === order._id ? { ...o, status: previous } : o)),
      );
      setMessage(error.message);
    } finally {
      setBusyId(null);
    }
  };

  const filters = [
    { value: 'active', label: 'In progress', count: activeCount },
    ...ORDER_STATUSES.map((s) => ({
      value: s,
      label: s[0].toUpperCase() + s.slice(1),
      count: counts[s],
    })),
    { value: 'all', label: 'All', count: all.length },
  ];

  return (
    <>
      <SEO noIndex title="Orders" />
      <AdminPageHeader
        title="Orders"
        description="Move orders along as the kitchen works through them."
        actions={
          <Button
            variant="ghost"
            size="sm"
            icon={RotateCw}
            onClick={orders.reload}
            disabled={orders.loading}
          >
            {orders.loading ? 'Refreshing...' : 'Refresh'}
          </Button>
        }
      />
      <div className={styles.toolbar}>
        <FilterChips
          options={filters}
          value={filter}
          onChange={setFilter}
          label="Filter orders by status"
        />
      </div>
      <p className={styles.status} role="status">
        {message}
      </p>
      <AdminState data={orders.data} error={orders.error} onRetry={orders.reload}>
        {visible.length ? (
          <Panel flush>
            <OrdersTable orders={visible} onStatusChange={changeStatus} busyId={busyId} />
          </Panel>
        ) : (
          <EmptyState title="No orders here." text="Orders with this status will show up here." />
        )}
      </AdminState>
    </>
  );
}

export default ManageOrders;
