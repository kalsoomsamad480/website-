/** Picks one item from the list that stays the same all day and changes daily. */
export default function dailyPick(list, date = new Date()) {
  if (!list.length) return null;
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date - startOfYear) / 86_400_000);
  return list[dayOfYear % list.length];
}
