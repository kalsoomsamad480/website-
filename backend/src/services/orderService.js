import MenuItem from '../db/models/MenuItem.js';
import Order from '../db/models/Order.js';
import { nextSequence } from '../db/models/Counter.js';
import cafeInfo from '../data/cafeInfo.js';
import ApiError from '../utils/ApiError.js';
import { roundMoney } from '../utils/helpers.js';

/** Places an order. Prices always come from the database, never from the client. */
export async function createOrder(user, { items, orderType, paymentMethod, notes = '' }) {
  // Merge duplicate lines for the same item
  const quantities = new Map();
  items.forEach(({ menuItem, quantity }) => {
    quantities.set(menuItem, Math.min(20, (quantities.get(menuItem) || 0) + quantity));
  });

  const menuItems = await MenuItem.find({
    _id: { $in: [...quantities.keys()] },
  }).lean();
  if (menuItems.length !== quantities.size) {
    throw ApiError.unprocessable('Some items are no longer on the menu. Please review your cart.');
  }
  const unavailable = menuItems.filter((item) => !item.isAvailable).map((item) => item.name);
  if (unavailable.length) {
    throw ApiError.unprocessable(
      `Sold out today: ${unavailable.join(', ')}. Please remove them to continue.`,
    );
  }

  const lines = menuItems.map((item) => ({
    menuItem: item._id,
    name: item.name,
    price: item.price,
    quantity: quantities.get(String(item._id)),
  }));
  const subtotal = roundMoney(lines.reduce((sum, line) => sum + line.price * line.quantity, 0));
  const tax = roundMoney(subtotal * cafeInfo.taxRate);

  return Order.create({
    orderNumber: `SM-${await nextSequence('order')}`,
    user: user._id,
    items: lines,
    subtotal,
    tax,
    total: roundMoney(subtotal + tax),
    orderType,
    paymentMethod,
    notes,
  });
}

export function listMyOrders(user) {
  return Order.find({ user: user._id }).sort({ createdAt: -1 }).lean();
}

export function listOrders({ status, date } = {}) {
  const filter = status ? { status } : {};
  if (date) {
    // The whole local calendar day
    const [year, month, day] = date.split('-').map(Number);
    filter.createdAt = {
      $gte: new Date(year, month - 1, day),
      $lt: new Date(year, month - 1, day + 1),
    };
  }
  return Order.find(filter).sort({ createdAt: -1 }).populate('user', 'name email phone').lean();
}

export async function updateOrderStatus(id, status) {
  const order = await Order.findByIdAndUpdate(
    id,
    { status },
    { returnDocument: 'after', runValidators: true },
  ).lean();
  if (!order) throw ApiError.notFound('Order not found.');
  return order;
}
