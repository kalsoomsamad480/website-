// Matches the backend tax rate (cafeInfo.taxRate). The server's totals are always final.
export const TAX_RATE = 0.08;

export const roundMoney = (value) => Math.round(value * 100) / 100;

/** Subtotal, tax, and total for [{ price, quantity }]. */
export function calculateTotals(lines) {
  const subtotal = roundMoney(lines.reduce((sum, line) => sum + line.price * line.quantity, 0));
  const tax = roundMoney(subtotal * TAX_RATE);
  return { subtotal, tax, total: roundMoney(subtotal + tax) };
}
