import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Merges Tailwind classes cleanly so later classes override earlier ones.
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
