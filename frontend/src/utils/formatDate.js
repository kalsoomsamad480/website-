const pad = (value) => String(value).padStart(2, '0');

const shortDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
const longDate = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
});
const dateTime = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

/** "2026-10-29T..." -> "Oct 29" */
export function formatShortDate(value) {
  return shortDate.format(new Date(value));
}

/** ISO timestamp -> "Oct 29, 4:05 PM" */
export function formatDateTime(value) {
  return dateTime.format(new Date(value));
}

/** Local Date -> "YYYY-MM-DD" */
export function toDateString(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** "YYYY-MM-DD" -> local Date (no UTC shift) */
export function parseDateString(value) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/** "2026-10-01" -> "Thursday, October 1" */
export function formatLongDate(value) {
  return longDate.format(parseDateString(value));
}

/** The next `count` days starting today, as "YYYY-MM-DD" strings. */
export function upcomingDates(count, from = new Date()) {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(from.getFullYear(), from.getMonth(), from.getDate() + index);
    return toDateString(date);
  });
}
