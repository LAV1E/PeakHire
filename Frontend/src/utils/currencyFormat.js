/**
 * Format number as INR currency
 */
export function formatCurrency(amount, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format salary range
 */
export function formatSalaryRange(min, max, currency = "INR") {
  return `${formatCurrency(min, currency)} – ${formatCurrency(max, currency)}`;
}

/**
 * Compact number format: 1200000 → "₹12L", 100000 → "₹1L"
 */
export function formatCompactCurrency(amount) {
  if (amount >= 10_000_000) {
    return `₹${(amount / 10_000_000).toFixed(1)}Cr`;
  }
  if (amount >= 100_000) {
    return `₹${(amount / 100_000).toFixed(1)}L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(0)}K`;
  }
  return `₹${amount}`;
}
