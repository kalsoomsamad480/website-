import { describe, expect, it } from 'vitest';
import { filterMenu } from './filterMenu';
import { calculateTotals, roundMoney } from './money';
import { formatTime, getGroupedHours, getOpenStatus } from './openingHours';
import { parseDateString, toDateString, upcomingDates } from './formatDate';
import dailyPick from './dailyPick';
import redirectTarget from './redirectTarget';
import formatPrice from './formatPrice';
import { isEmail, isPhone, passwordProblem } from './validators';

const item = (name, price, slug, tags = [], ingredients = []) => ({
  name,
  price,
  tags,
  ingredients,
  description: `${name} description`,
  category: { slug },
});
const MENU = [
  item('Flat White', 4.5, 'coffee', ['veg', 'strong', 'popular'], ['Espresso', 'Milk']),
  item('Cardamom Latte', 5.2, 'coffee', ['veg', 'sweet'], ['Cardamom syrup']),
  item('Cold Brew', 4.8, 'cold-drinks', ['veg', 'strong', 'iced']),
  item('Chicken Tikka Rice Bowl', 11.5, 'meals', ['popular']),
];

describe('filterMenu', () => {
  it('filters by category, tags, price, and search', () => {
    expect(filterMenu(MENU, { category: 'coffee' })).toHaveLength(2);
    expect(filterMenu(MENU, { tags: ['strong', 'iced'] }).map((i) => i.name)).toEqual(['Cold Brew']);
    expect(filterMenu(MENU, { price: 'over-10' }).map((i) => i.name)).toEqual(['Chicken Tikka Rice Bowl']);
    expect(filterMenu(MENU, { search: 'cardamom' }).map((i) => i.name)).toEqual(['Cardamom Latte']);
    expect(filterMenu(MENU, { search: 'espresso' }).map((i) => i.name)).toEqual(['Flat White']);
  });

  it('sorts without mutating the original list', () => {
    const sorted = filterMenu(MENU, { sort: 'price-desc' });
    expect(sorted[0].name).toBe('Chicken Tikka Rice Bowl');
    expect(MENU[0].name).toBe('Flat White');
  });
});

describe('money', () => {
  it('rounds to cents and adds 8% tax', () => {
    expect(roundMoney(0.1 + 0.2)).toBe(0.3);
    expect(calculateTotals([{ price: 4.5, quantity: 3 }, { price: 3.9, quantity: 1 }])).toEqual({
      subtotal: 17.4,
      tax: 1.39,
      total: 18.79,
    });
    expect(formatPrice(5.2)).toBe('$5.20');
  });
});

describe('opening hours', () => {
  it('formats times', () => {
    expect(formatTime('22:00')).toBe('10 pm');
    expect(formatTime('08:30')).toBe('8:30 am');
    expect(formatTime('12:00')).toBe('12 pm');
  });

  it('knows when the cafe is open', () => {
    const tuesdayNoon = new Date(2026, 8, 29, 12, 0);
    const tuesdayLate = new Date(2026, 8, 29, 22, 30);
    const saturdayEarly = new Date(2026, 9, 3, 7, 0);
    expect(getOpenStatus(tuesdayNoon)).toEqual({ isOpen: true, label: 'Open until 10 pm' });
    expect(getOpenStatus(tuesdayLate).label).toBe('Opens 8 am tomorrow');
    expect(getOpenStatus(saturdayEarly).label).toBe('Opens 8 am today');
  });

  it('groups days that share hours', () => {
    expect(getGroupedHours().map((g) => g.label)).toEqual(['Monday to Saturday', 'Sunday']);
  });
});

describe('dates', () => {
  it('round-trips local dates without timezone shifts', () => {
    expect(toDateString(parseDateString('2026-10-01'))).toBe('2026-10-01');
    expect(upcomingDates(3, new Date(2026, 11, 31))).toEqual(['2026-12-31', '2027-01-01', '2027-01-02']);
  });

  it('daily pick is stable within a day', () => {
    const list = ['a', 'b', 'c'];
    const morning = dailyPick(list, new Date(2026, 8, 29, 8));
    expect(dailyPick(list, new Date(2026, 8, 29, 21))).toBe(morning);
    expect(dailyPick([], new Date())).toBeNull();
  });
});

describe('redirects and validation', () => {
  it('sends users back where they came from, or to their home', () => {
    expect(redirectTarget({ from: { pathname: '/checkout', search: '' } }, { role: 'customer' })).toBe('/checkout');
    expect(redirectTarget(null, { role: 'admin' })).toBe('/admin');
    expect(redirectTarget(undefined, { role: 'customer' })).toBe('/profile');
  });

  it('mirrors the backend form rules', () => {
    expect(isEmail('sara@example.com')).toBe(true);
    expect(isEmail('sara@')).toBe(false);
    expect(isPhone('+92 300 1234567')).toBe(true);
    expect(passwordProblem('short1')).toMatch(/8 characters/);
    expect(passwordProblem('longenough')).toMatch(/number/);
    expect(passwordProblem('Secret123')).toBe('');
  });
});
