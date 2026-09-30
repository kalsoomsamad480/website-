const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

/** 5.2 -> "$5.20" */
export default function formatPrice(value) {
  return formatter.format(value);
}
