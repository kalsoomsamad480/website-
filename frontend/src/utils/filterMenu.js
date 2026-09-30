export const MENU_FILTER_TAGS = [
  { value: 'veg', label: 'Vegetarian' },
  { value: 'popular', label: 'Popular' },
  { value: 'new', label: 'New' },
  { value: 'strong', label: 'Strong' },
  { value: 'sweet', label: 'Sweet' },
  { value: 'iced', label: 'Iced' },
];

export const PRICE_RANGES = [
  { value: 'any', label: 'Any price', test: () => true },
  { value: 'under-5', label: 'Under $5', test: (price) => price < 5 },
  { value: '5-10', label: '$5 to $10', test: (price) => price >= 5 && price <= 10 },
  { value: 'over-10', label: 'Over $10', test: (price) => price > 10 },
];

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'name', label: 'Name: A to Z' },
];

const SORTERS = {
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  name: (a, b) => a.name.localeCompare(b.name),
};

/** Pure, client-side menu filtering. */
export function filterMenu(
  items,
  { category = 'all', search = '', tags = [], price = 'any', sort = 'featured' },
) {
  const query = search.trim().toLowerCase();
  const range = PRICE_RANGES.find((option) => option.value === price) || PRICE_RANGES[0];

  const result = items.filter((item) => {
    if (category !== 'all' && item.category?.slug !== category) return false;
    if (!tags.every((tag) => item.tags.includes(tag))) return false;
    if (!range.test(item.price)) return false;
    if (!query) return true;
    return [item.name, item.description, ...item.ingredients].some((text) =>
      text.toLowerCase().includes(query),
    );
  });

  return SORTERS[sort] ? [...result].sort(SORTERS[sort]) : result;
}
