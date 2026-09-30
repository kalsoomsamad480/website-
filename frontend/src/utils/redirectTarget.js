/** Where to go after signing in: back to the page that asked, else the admin panel or profile. */
export default function redirectTarget(state, user) {
  const from = state?.from;
  if (from) return `${from.pathname}${from.search || ''}`;
  return user?.role === 'admin' ? '/admin' : '/profile';
}
