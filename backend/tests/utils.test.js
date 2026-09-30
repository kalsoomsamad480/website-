import { test } from 'node:test';
import assert from 'node:assert/strict';
import { escapeRegex, isObjectId, pick, roundMoney } from '../src/utils/helpers.js';
import slugify from '../src/utils/slugify.js';
import { getSlotsForDate, isBookableDate, toDateString } from '../src/utils/timeSlots.js';

// Tuesday 2026-09-29, 14:10 local time
const NOW = new Date(2026, 8, 29, 14, 10);

test('slugify makes clean URL slugs', () => {
  assert.equal(slugify('Honey Cinnamon Cappuccino!'), 'honey-cinnamon-cappuccino');
  assert.equal(slugify('Sourdough Toast & Butter'), 'sourdough-toast-and-butter');
  assert.equal(slugify('  Café  Crème '), 'cafe-creme');
});

test('helpers', () => {
  assert.deepEqual(pick({ a: 1, b: undefined, c: 3, role: 'admin' }, ['a', 'b', 'c']), { a: 1, c: 3 });
  assert.equal(roundMoney(0.1 + 0.2), 0.3);
  assert.equal(roundMoney(17.4 * 0.08), 1.39);
  assert.equal(escapeRegex('.*'), '\\.\\*');
  assert.ok(isObjectId('6abbe872cafa7f225fa81830'));
  assert.ok(!isObjectId('cardamom-bun'));
});

test('bookable dates: today up to 30 days ahead, real calendar dates only', () => {
  assert.ok(isBookableDate('2026-09-29', NOW));
  assert.ok(isBookableDate('2026-10-29', NOW));
  assert.ok(!isBookableDate('2026-10-30', NOW));
  assert.ok(!isBookableDate('2026-09-28', NOW));
  assert.ok(!isBookableDate('2026-02-31', NOW));
  assert.ok(!isBookableDate('tomorrow', NOW));
});

test('weekday slots run every 30 minutes until one hour before closing', () => {
  const slots = getSlotsForDate('2026-09-30', NOW); // Wednesday, 8 am to 10 pm
  assert.equal(slots[0], '08:00');
  assert.equal(slots.at(-1), '21:00');
  assert.equal(slots.length, 27);
});

test('sunday uses shorter hours', () => {
  const slots = getSlotsForDate('2026-10-04', NOW); // Sunday, 9 am to 8 pm
  assert.equal(slots[0], '09:00');
  assert.equal(slots.at(-1), '19:00');
});

test('today only offers slots at least 30 minutes away', () => {
  const slots = getSlotsForDate(toDateString(NOW), NOW);
  assert.equal(slots[0], '15:00'); // 14:10 + 30 min -> first slot 15:00
});
