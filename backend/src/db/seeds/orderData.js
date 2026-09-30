// Items reference menu slugs; seed.js resolves prices from the menu and calculates totals.
const orderData = [
  {
    orderNumber: 'SM-1001',
    daysAgo: 6,
    status: 'completed',
    orderType: 'dine-in',
    paymentMethod: 'card',
    items: [
      { slug: 'flat-white', quantity: 2 },
      { slug: 'butter-croissant', quantity: 2 },
    ],
  },
  {
    orderNumber: 'SM-1002',
    daysAgo: 5,
    status: 'completed',
    orderType: 'pickup',
    paymentMethod: 'wallet',
    items: [
      { slug: 'iced-spanish-latte', quantity: 1 },
      { slug: 'basque-cheesecake', quantity: 1 },
    ],
  },
  {
    orderNumber: 'SM-1003',
    daysAgo: 4,
    status: 'cancelled',
    orderType: 'pickup',
    paymentMethod: 'cash',
    notes: 'Customer changed plans.',
    items: [{ slug: 'alladin-smash-burger', quantity: 1 }],
  },
  {
    orderNumber: 'SM-1004',
    daysAgo: 3,
    status: 'completed',
    orderType: 'dine-in',
    paymentMethod: 'card',
    items: [
      { slug: 'chicken-tikka-rice-bowl', quantity: 1 },
      { slug: 'hibiscus-lemonade', quantity: 1 },
    ],
  },
  {
    orderNumber: 'SM-1005',
    daysAgo: 2,
    status: 'completed',
    orderType: 'dine-in',
    paymentMethod: 'cash',
    items: [
      { slug: 'cold-brew', quantity: 1 },
      { slug: 'avocado-toast', quantity: 1 },
      { slug: 'cardamom-bun', quantity: 1 },
    ],
  },
  {
    orderNumber: 'SM-1006',
    daysAgo: 1,
    status: 'ready',
    orderType: 'pickup',
    paymentMethod: 'card',
    notes: 'Extra hot, please.',
    items: [
      { slug: 'cardamom-latte', quantity: 2 },
      { slug: 'almond-croissant', quantity: 1 },
    ],
  },
  {
    orderNumber: 'SM-1007',
    daysAgo: 0,
    status: 'preparing',
    orderType: 'dine-in',
    paymentMethod: 'wallet',
    items: [
      { slug: 'halloumi-grain-bowl', quantity: 1 },
      { slug: 'espresso-tonic', quantity: 1 },
    ],
  },
  {
    orderNumber: 'SM-1008',
    daysAgo: 0,
    status: 'pending',
    orderType: 'pickup',
    paymentMethod: 'cash',
    items: [
      { slug: 'oat-cortado', quantity: 1 },
      { slug: 'salted-caramel-brownie', quantity: 2 },
    ],
  },
];

export default orderData;
