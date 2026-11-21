/**
 * Returns today's LOCAL date formatted as "YYYY-MM-DD".
 * Uses local year/month/day instead of toISOString() so timezones don't shift the day.
 */
export function todayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Returns a time-of-day greeting based on the student's local clock.
 */
export function getTimeOfDayGreeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}
