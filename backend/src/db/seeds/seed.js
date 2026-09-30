import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';
import { connectDB, disconnectDB } from '../connection.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import MenuItem from '../models/MenuItem.js';
import Order from '../models/Order.js';
import Reservation from '../models/Reservation.js';
import Offer from '../models/Offer.js';
import Testimonial from '../models/Testimonial.js';
import ContactMessage from '../models/ContactMessage.js';
import GalleryImage from '../models/GalleryImage.js';
import Counter from '../models/Counter.js';
import SlotCounter from '../models/SlotCounter.js';
import { rebuildSlotCounters } from '../../services/reservationService.js';
import categoryData from './categoryData.js';
import menuData from './menuData.js';
import userData from './userData.js';
import orderData from './orderData.js';
import reservationData from './reservationData.js';
import offerData from './offerData.js';
import testimonialData from './testimonialData.js';
import galleryData from './galleryData.js';
import cafeInfo from '../../data/cafeInfo.js';
import slugify from '../../utils/slugify.js';
import { roundMoney } from '../../utils/helpers.js';
import logger from '../../utils/logger.js';

const DAY_MS = 24 * 60 * 60 * 1000;
const pad = (value) => String(value).padStart(2, '0');
const toDateString = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const ALL_MODELS = [
  User,
  Category,
  MenuItem,
  Order,
  Reservation,
  Offer,
  Testimonial,
  ContactMessage,
  GalleryImage,
  Counter,
  SlotCounter,
];

/** Clears every collection and inserts the demo data. Returns document counts. */
export async function seedDatabase() {
  await Promise.all(ALL_MODELS.map((model) => model.deleteMany({})));
  await Promise.all(ALL_MODELS.map((model) => model.syncIndexes()));
  const now = Date.now();

  const users = await User.insertMany(
    await Promise.all(
      userData.map(async ({ password, ...user }) => ({
        ...user,
        passwordHash: await bcrypt.hash(password, 10),
      })),
    ),
  );
  const customer = users.find((user) => user.role === 'customer');

  const categories = await Category.insertMany(categoryData);
  const categoryIds = Object.fromEntries(
    categories.map((category) => [category.slug, category._id]),
  );

  const menuItems = await MenuItem.insertMany(
    menuData.map((item) => {
      const slug = slugify(item.name);
      return {
        ...item,
        slug,
        category: categoryIds[item.category],
        image: `/images/menu/${slug}.webp`,
      };
    }),
  );
  const menuBySlug = Object.fromEntries(menuItems.map((item) => [item.slug, item]));

  const orders = await Order.insertMany(
    orderData.map(({ daysAgo, items, ...order }) => {
      const lines = items.map(({ slug, quantity }) => {
        const item = menuBySlug[slug];
        if (!item) throw new Error(`Unknown menu slug in orderData: ${slug}`);
        return {
          menuItem: item._id,
          name: item.name,
          price: item.price,
          quantity,
        };
      });
      const subtotal = roundMoney(lines.reduce((sum, line) => sum + line.price * line.quantity, 0));
      const tax = roundMoney(subtotal * cafeInfo.taxRate);
      return {
        ...order,
        user: customer._id,
        items: lines,
        subtotal,
        tax,
        total: roundMoney(subtotal + tax),
      };
    }),
  );

  // Mongoose stamps createdAt at insert time, so backdate orders with a raw update
  await Order.collection.bulkWrite(
    orders.map((order, index) => {
      const placedAt = new Date(now - orderData[index].daysAgo * DAY_MS - index * 25 * 60 * 1000);
      return {
        updateOne: {
          filter: { _id: order._id },
          update: { $set: { createdAt: placedAt, updatedAt: placedAt } },
        },
      };
    }),
  );

  // New orders continue after the highest seeded number (SM-1008 -> SM-1009)
  const lastOrderNumber = Math.max(
    ...orderData.map((order) => Number(order.orderNumber.split('-')[1])),
  );
  await Counter.create({ _id: 'order', seq: lastOrderNumber });

  await Reservation.insertMany(
    reservationData.map(({ daysFromNow, linkCustomer, ...reservation }) => ({
      ...reservation,
      user: linkCustomer ? customer._id : undefined,
      date: toDateString(new Date(now + daysFromNow * DAY_MS)),
    })),
  );

  // Seat counters must match the seeded reservations
  await rebuildSlotCounters();

  await Offer.insertMany(
    offerData.map(({ validForDays, ...offer }) => ({
      ...offer,
      validTill: new Date(now + validForDays * DAY_MS),
    })),
  );

  await Testimonial.insertMany(testimonialData);
  await GalleryImage.insertMany(galleryData);

  const counts = Object.fromEntries(
    await Promise.all(
      ALL_MODELS.map(async (model) => [
        model.collection.collectionName,
        await model.countDocuments(),
      ]),
    ),
  );
  logger.info('Database seeded:', counts);
  return counts;
}

// Run directly with `npm run seed`
const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isCli) {
  try {
    const { isMemory } = await connectDB();
    if (isMemory) {
      logger.warn(
        'USE_MEMORY_DB=true: this seed is temporary. The dev server seeds itself on start.',
      );
    }
    await seedDatabase();
  } catch (error) {
    logger.error('Seed failed:', error);
    process.exitCode = 1;
  } finally {
    await disconnectDB();
  }
}
