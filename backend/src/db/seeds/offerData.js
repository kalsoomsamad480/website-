// `validForDays` is converted to a validTill date when seeding.
const offerData = [
  {
    title: 'Study Pass Breakfast',
    description: 'Get a free butter croissant with any Day Pass booked before 10 am.',
    discountText: 'Free croissant',
    image: '/images/offers/study-breakfast.webp',
    validForDays: 30,
    isActive: true,
  },
  {
    title: 'Afternoon Cold Brew Hour',
    description: 'Every weekday from 3 pm to 5 pm, all cold drinks are 20% off.',
    discountText: '20% off',
    image: '/images/offers/cold-brew-hour.webp',
    validForDays: 45,
    isActive: true,
  },
  {
    title: 'Bring a Study Buddy',
    description: 'Order two coffees together and get the second one at half price.',
    discountText: '2nd coffee 50% off',
    image: '/images/offers/study-buddy.webp',
    validForDays: 60,
    isActive: true,
  },
];

export default offerData;
