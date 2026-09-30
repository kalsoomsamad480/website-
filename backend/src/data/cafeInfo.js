// Single source of cafe facts, served by GET /api/v1/info and used by the AI agent.
// dayIndex follows Date.getDay(): 0 = Sunday.

const cafeInfo = {
  name: 'Alladin Cafe',
  tagline: 'A neighborhood cafe with good coffee, quiet corners, and seats made for deep work.',
  address: {
    line1: '12 Garden Street',
    city: 'Old Town',
    postalCode: '54000',
    full: '12 Garden Street, Old Town, 54000',
  },
  phone: '+00 123 456 789',
  email: 'hello@alladin.cafe',
  mapUrl: 'https://maps.google.com/?q=12+Garden+Street',
  socials: [
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'Facebook', href: 'https://facebook.com' },
    { label: 'TikTok', href: 'https://tiktok.com' },
  ],
  hours: [
    { dayIndex: 1, day: 'Monday', open: '08:00', close: '22:00' },
    { dayIndex: 2, day: 'Tuesday', open: '08:00', close: '22:00' },
    { dayIndex: 3, day: 'Wednesday', open: '08:00', close: '22:00' },
    { dayIndex: 4, day: 'Thursday', open: '08:00', close: '22:00' },
    { dayIndex: 5, day: 'Friday', open: '08:00', close: '22:00' },
    { dayIndex: 6, day: 'Saturday', open: '08:00', close: '22:00' },
    { dayIndex: 0, day: 'Sunday', open: '09:00', close: '20:00' },
  ],
  currency: 'USD',
  taxRate: 0.08,
  amenities: [
    {
      title: 'Fast Wi-Fi',
      description: '300 Mbps fiber. The password is printed on your receipt.',
    },
    {
      title: 'Power at every seat',
      description: 'Two sockets and a USB-C port at every desk and table.',
    },
    {
      title: 'Quiet zone',
      description:
        'A silent room for deep work. Calls and music without headphones are not allowed.',
    },
    {
      title: 'Open late',
      description: 'Open until 10 pm Monday to Saturday, and 8 pm on Sunday.',
    },
  ],
  studySpace: {
    zones: [
      {
        name: 'Quiet Room',
        seats: 18,
        description: 'Silent study with long desks, warm lamps, and no calls.',
      },
      {
        name: 'Focus Bar',
        seats: 12,
        description: 'Window counter seats for solo work, with sockets at every seat.',
      },
      {
        name: 'Group Tables',
        seats: 24,
        description: 'Large tables for group projects, where conversation is welcome.',
      },
    ],
    passes: [
      {
        name: 'Hourly',
        price: 3,
        description: 'Any study seat, billed by the hour.',
      },
      {
        name: 'Day Pass',
        price: 12,
        description: 'Unlimited hours for the day, plus one free coffee.',
      },
      {
        name: 'Weekly Pass',
        price: 50,
        description: 'Seven day passes to use within one month.',
      },
    ],
    rules: [
      'Keep the Quiet Room silent. Take calls to the Group Tables or outside.',
      'Use headphones for any audio.',
      'Seats are held for 20 minutes if you step away.',
      'Please order at least one item every three hours on the Hourly pass.',
      'Outside food is not allowed.',
    ],
  },
  reservations: {
    slotMinutes: 30,
    maxDaysAhead: 30,
    tableGuests: { min: 1, max: 8 },
    studyDeskGuests: 1,
    // Guests that can be booked into one time slot (Group Tables; Quiet Room + Focus Bar)
    capacityPerSlot: { table: 24, 'study-desk': 30 },
  },
};

export default cafeInfo;
