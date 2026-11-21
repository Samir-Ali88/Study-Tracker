/**
 * Calculates course completion percentage using the 99% rule:
 * - Raw percent = Math.round((done / total) * 100)
 * - While markedComplete is false, the percentage NEVER exceeds 99%.
 * - Only when markedComplete is true does it return 100%.
 *
 * @param {number} done - Number of ticked topics
 * @param {number} total - Total number of final exam topics
 * @param {boolean} markedComplete - Whether the student pressed "Mark course complete"
 * @returns {number} Integer from 0 to 100
 */
export function calculatePercent(done, total, markedComplete) {
  if (markedComplete) {
    return 100;
  }

  if (!total || total <= 0) {
    return 0;
  }

  const clampedDone = Math.max(0, Math.min(done, total));
  const rawPercent = Math.round((clampedDone / total) * 100);

  // Enforce the 99% rule until the student explicitly marks the course complete
  return Math.min(rawPercent, 99);
}
