import {
  format,
  formatDistanceToNow,
  parseISO,
  isValid,
  differenceInSeconds,
} from "date-fns";

/**
 * Format a date string to "Jan 5, 2024"
 */
export function formatDate(dateStr) {
  const date = typeof dateStr === "string" ? parseISO(dateStr) : dateStr;
  if (!isValid(date)) return "Invalid date";
  return format(date, "MMM d, yyyy");
}

/**
 * Format a date string to "Jan 5, 2024 · 3:30 PM"
 */
export function formatDateTime(dateStr) {
  const date = typeof dateStr === "string" ? parseISO(dateStr) : dateStr;
  if (!isValid(date)) return "Invalid date";
  return format(date, "MMM d, yyyy · h:mm a");
}

/**
 * Format time only: "3:30 PM"
 */
export function formatTime(dateStr) {
  const date = typeof dateStr === "string" ? parseISO(dateStr) : dateStr;
  if (!isValid(date)) return "Invalid time";
  return format(date, "h:mm a");
}

/**
 * Relative time: "2 hours ago", "in 3 days"
 */
export function formatRelative(dateStr) {
  const date = typeof dateStr === "string" ? parseISO(dateStr) : dateStr;
  if (!isValid(date)) return "Invalid date";
  return formatDistanceToNow(date, { addSuffix: true });
}

/**
 * Countdown: returns { days, hours, minutes, seconds } until targetDate
 */
export function getCountdown(dateStr) {
  const date = typeof dateStr === "string" ? parseISO(dateStr) : dateStr;
  const now = new Date();
  const isPast = date <= now;
  const totalSeconds = Math.abs(differenceInSeconds(date, now));

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, isPast };
}

/**
 * Format year only
 */
export function formatYear(dateStr) {
  const date = typeof dateStr === "string" ? parseISO(dateStr) : dateStr;
  if (!isValid(date)) return "Invalid date";
  return format(date, "yyyy");
}

/**
 * Format month + year: "Jan 2024"
 */
export function formatMonthYear(dateStr) {
  const date = typeof dateStr === "string" ? parseISO(dateStr) : dateStr;
  if (!isValid(date)) return "Invalid date";
  return format(date, "MMM yyyy");
}
