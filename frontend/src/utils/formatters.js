/* ────────────────────────────────────────────
   formatters — Display format utilities
   ──────────────────────────────────────────── */

/**
 * Get initials from a full name
 * @param {string} name
 * @returns {string} "JD" for "John Doe"
 */
export function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Format ISO date string to readable format
 * @param {string} dateStr - ISO date (YYYY-MM-DD)
 * @returns {string} Formatted date like "Jun 15"
 */
export function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

/**
 * Format full date with year
 * @param {string} dateStr
 * @returns {string} "Jun 15, 2026"
 */
export function formatDateFull(dateStr) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Format number as currency
 * @param {number|string} amount
 * @returns {string} "$1,234.00"
 */
export function formatCurrency(amount, currencyCode = 'USD') {
  const num = parseFloat(amount);
  if (isNaN(num)) return currencyCode === 'INR' ? '₹0' : '$0';
  return new Intl.NumberFormat(currencyCode === 'INR' ? 'en-IN' : 'en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Calculate days between two dates
 * @param {string} startDate
 * @param {string} endDate
 * @returns {number}
 */
export function daysBetween(startDate, endDate) {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.max(0, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
}

/**
 * Truncate text with ellipsis
 * @param {string} text
 * @param {number} maxLen
 * @returns {string}
 */
export function truncate(text, maxLen = 100) {
  if (!text || text.length <= maxLen) return text || '';
  return text.slice(0, maxLen).trim() + '…';
}

/**
 * Determine currency code based on trip data
 * @param {Object} trip
 * @returns {string} 'INR' or 'USD'
 */
export function getTripCurrency(trip) {
  if (!trip) return 'USD';
  if (trip.country && trip.country.toLowerCase() === 'india') return 'INR';
  
  const name = (trip.tripName || '').toLowerCase();
  const desc = (trip.description || '').toLowerCase();
  if (name.includes('india') || name.includes('goa') || desc.includes('india')) return 'INR';
  if (trip.stops?.some(s => s.city?.country?.toLowerCase() === 'india')) return 'INR';
  return 'USD';
}
