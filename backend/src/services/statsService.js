import ContactMessage from '../db/models/ContactMessage.js';
import MenuItem from '../db/models/MenuItem.js';
import Order from '../db/models/Order.js';
import Reservation from '../db/models/Reservation.js';
import { roundMoney } from '../utils/helpers.js';
import { toDateString } from '../utils/timeSlots.js';

// Group revenue by the cafe's local calendar day
const TIME_ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;
const DAY_MS = 24 * 60 * 60 * 1000;

function startOfToday(now) {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/** Everything the admin dashboard needs in one call. */
export async function getDashboardStats(now = new Date()) {
  const todayStart = startOfToday(now);
  const weekStart = new Date(todayStart.getTime() - 6 * DAY_MS);
  const monthStart = new Date(todayStart.getTime() - 29 * DAY_MS);
  const today = toDateString(now);
  const notCancelled = { status: { $ne: 'cancelled' } };

  const [
    todayOrders,
    pendingOrders,
    dailyRevenue,
    popularItems,
    recentOrders,
    todayReservations,
    pendingReservations,
    upcomingReservations,
    unreadMessages,
    menuTotal,
    menuUnavailable,
  ] = await Promise.all([
    Order.find({ createdAt: { $gte: todayStart }, ...notCancelled })
      .select('total')
      .lean(),
    Order.countDocuments({ status: 'pending' }),
    Order.aggregate([
      { $match: { createdAt: { $gte: weekStart }, ...notCancelled } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: TIME_ZONE } },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 },
        },
      },
    ]),
    Order.aggregate([
      { $match: { createdAt: { $gte: monthStart }, ...notCancelled } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.name',
          quantity: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        },
      },
      { $sort: { quantity: -1, revenue: -1 } },
      { $limit: 5 },
    ]),
    Order.find().sort({ createdAt: -1 }).limit(6).populate('user', 'name').lean(),
    Reservation.countDocuments({ date: today, status: { $in: ['pending', 'approved'] } }),
    Reservation.countDocuments({ status: 'pending' }),
    Reservation.find({ date: { $gte: today }, status: { $in: ['pending', 'approved'] } })
      .sort({ date: 1, time: 1 })
      .limit(6)
      .lean(),
    ContactMessage.countDocuments({ isRead: false }),
    MenuItem.countDocuments(),
    MenuItem.countDocuments({ isAvailable: false }),
  ]);

  // Fill in days with no orders so the chart always shows 7 bars
  const byDay = new Map(dailyRevenue.map((day) => [day._id, day]));
  const revenueByDay = Array.from({ length: 7 }, (_, index) => {
    const date = toDateString(new Date(weekStart.getTime() + index * DAY_MS));
    const day = byDay.get(date);
    return { date, revenue: roundMoney(day?.revenue || 0), orders: day?.orders || 0 };
  });

  return {
    today: {
      orders: todayOrders.length,
      revenue: roundMoney(todayOrders.reduce((sum, order) => sum + order.total, 0)),
      reservations: todayReservations,
    },
    pending: { orders: pendingOrders, reservations: pendingReservations, messages: unreadMessages },
    week: {
      revenue: roundMoney(revenueByDay.reduce((sum, day) => sum + day.revenue, 0)),
      orders: revenueByDay.reduce((sum, day) => sum + day.orders, 0),
      byDay: revenueByDay,
    },
    menu: { total: menuTotal, unavailable: menuUnavailable },
    popularItems: popularItems.map((item) => ({
      name: item._id,
      quantity: item.quantity,
      revenue: roundMoney(item.revenue),
    })),
    recentOrders,
    upcomingReservations,
  };
}
