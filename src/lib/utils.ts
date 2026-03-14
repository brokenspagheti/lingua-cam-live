import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * A utility function to merge Tailwind CSS classes using clsx and tailwind-merge.
 * This handles conditional classes and ensures that Tailwind's utility classes 
 * are correctly merged (e.g., resolving conflicts between 'p-2' and 'p-4').
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
