// Images are expected at frontend/public/images/gallery/ (added in Phase 3).
const galleryData = [
  {
    src: '/images/gallery/latte-art.webp',
    alt: 'Latte art in a ceramic cup on a wooden table',
    category: 'coffee',
    width: 800,
    height: 1000,
  },
  {
    src: '/images/gallery/quiet-room.webp',
    alt: 'The quiet room with long desks and warm lamps',
    category: 'space',
    width: 1200,
    height: 800,
  },
  {
    src: '/images/gallery/croissants.webp',
    alt: 'Fresh croissants cooling on a tray',
    category: 'food',
    width: 800,
    height: 800,
  },
  {
    src: '/images/gallery/barista-pour.webp',
    alt: 'Barista pouring steamed milk into espresso',
    category: 'people',
    width: 800,
    height: 1100,
  },
  {
    src: '/images/gallery/window-seats.webp',
    alt: 'Window bar seats with laptops and morning light',
    category: 'space',
    width: 1200,
    height: 900,
  },
  {
    src: '/images/gallery/cold-brew.webp',
    alt: 'Glass of cold brew with ice',
    category: 'coffee',
    width: 800,
    height: 1000,
  },
  {
    src: '/images/gallery/study-group.webp',
    alt: 'Friends studying together at a large table',
    category: 'people',
    width: 1200,
    height: 800,
  },
  {
    src: '/images/gallery/cheesecake.webp',
    alt: 'Slice of Basque cheesecake on a plate',
    category: 'food',
    width: 800,
    height: 900,
  },
  {
    src: '/images/gallery/pour-over.webp',
    alt: 'Pour over coffee being brewed',
    category: 'coffee',
    width: 800,
    height: 1200,
  },
  {
    src: '/images/gallery/rice-bowl.webp',
    alt: 'Chicken tikka rice bowl from above',
    category: 'food',
    width: 1000,
    height: 800,
  },
  {
    src: '/images/gallery/reading-corner.webp',
    alt: 'Reading corner with armchairs and bookshelves',
    category: 'space',
    width: 800,
    height: 1000,
  },
  {
    src: '/images/gallery/counter.webp',
    alt: 'Pastry counter with cakes and buns',
    category: 'food',
    width: 1200,
    height: 800,
  },
].map((image, index) => ({ ...image, order: index + 1 }));

export default galleryData;
