import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names with Tailwind CSS classes
 * This function combines clsx and tailwind-merge to handle class name conflicts
 * and provide a clean way to conditionally apply classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
} 