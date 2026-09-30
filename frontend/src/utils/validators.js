// Client-side checks that mirror the backend validators, for instant feedback.

export const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export const isPhone = (value) => /^[+\d\s()-]{7,20}$/.test(value.trim());

export function passwordProblem(value) {
  if (value.length < 8) return 'Use at least 8 characters.';
  if (!/[A-Za-z]/.test(value)) return 'Include at least one letter.';
  if (!/\d/.test(value)) return 'Include at least one number.';
  return '';
}

/** Returns only the entries that have an error message. */
export const compactErrors = (errors) =>
  Object.fromEntries(Object.entries(errors).filter(([, message]) => Boolean(message)));
