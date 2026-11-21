/**
 * Local fallback quotes shown on the Home page when the public quote API
 * cannot be reached (for example, when the device is offline).
 */
export const fallbackQuotes = [
  {
    quote: "Success is the sum of small efforts, repeated day in and day out.",
    author: "Robert Collier",
  },
  {
    quote: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius",
  },
  {
    quote: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
  },
  {
    quote: "Well begun is half done.",
    author: "Aristotle",
  },
  {
    quote: "Focus on being productive instead of busy.",
    author: "Tim Ferriss",
  },
  {
    quote: "Learning never exhausts the mind.",
    author: "Leonardo da Vinci",
  },
];

export function getFallbackQuoteForDate(dateKey) {
  // Deterministic pick based on today's date string so it stays steady all day
  let hash = 0;
  for (let i = 0; i < dateKey.length; i += 1) {
    hash = (hash * 31 + dateKey.charCodeAt(i)) % fallbackQuotes.length;
  }
  return fallbackQuotes[Math.abs(hash) % fallbackQuotes.length];
}
