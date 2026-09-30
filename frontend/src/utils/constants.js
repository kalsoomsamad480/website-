// Static cafe content used across the layout. Phase 2 moves this data to GET /api/v1/info.

export const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/study-space', label: 'Study Space' },
  { to: '/about', label: 'About' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
];

// dayIndex follows Date.getDay(): 0 = Sunday
export const OPENING_HOURS = [
  { dayIndex: 1, day: 'Monday', open: '08:00', close: '22:00' },
  { dayIndex: 2, day: 'Tuesday', open: '08:00', close: '22:00' },
  { dayIndex: 3, day: 'Wednesday', open: '08:00', close: '22:00' },
  { dayIndex: 4, day: 'Thursday', open: '08:00', close: '22:00' },
  { dayIndex: 5, day: 'Friday', open: '08:00', close: '22:00' },
  { dayIndex: 6, day: 'Saturday', open: '08:00', close: '22:00' },
  { dayIndex: 0, day: 'Sunday', open: '09:00', close: '20:00' },
];

export const VALUES = [
  {
    title: 'Made in-house',
    text: 'We roast in small batches, bake every morning, and make our syrups and sauces from scratch.',
  },
  {
    title: 'Room to think',
    text: 'No rushing, no loud music, and a seat for as long as you need it. Focus is on the menu too.',
  },
  {
    title: 'Neighborhood first',
    text: 'Local milk, local flour, and a community board for tutors, clubs, and study groups.',
  },
];

export const TEAM = [
  {
    name: 'Hira Nadeem',
    role: 'Founder and head barista',
    note: 'Drinks a cortado at 7 am sharp.',
    image: '/images/team/team-1.webp',
  },
  {
    name: 'Bilal Ahmed',
    role: 'Head baker',
    note: 'The reason the cardamom buns sell out by noon.',
    image: '/images/team/team-2.webp',
  },
  {
    name: 'Sameer Khan',
    role: 'Kitchen lead',
    note: 'Makes the tikka bowl the way his grandmother did.',
    image: '/images/team/team-3.webp',
  },
  {
    name: 'Danish Aziz',
    role: 'Barista and study space host',
    note: 'Keeps the quiet room quiet, kindly.',
    image: '/images/team/team-4.webp',
  },
];

export const CAFE_INFO = {
  name: 'Alladin Cafe',
  tagline: 'A neighborhood cafe with good coffee, quiet corners, and seats made for deep work.',
  address: ['12 Garden Street', 'Old Town, 54000'],
  phone: '+00 123 456 789',
  email: 'hello@alladin.cafe',
  mapUrl: 'https://maps.google.com/?q=12+Garden+Street',
  socials: [
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'Facebook', href: 'https://facebook.com' },
    { label: 'TikTok', href: 'https://tiktok.com' },
  ],
};
