import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges multiple tailwind classes and handles conditional classes efficiently.
 * @param inputs - List of class names or conditional class objects.
 * @returns A single string of merged tailwind classes.
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

/**
 * Formats a date into a human-readable business format.
 * @param date - Date object or ISO string.
 * @returns Formatted date string.
 */
export function formatDate(date: Date | string): string {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(date));
}

/**
 * Safely parses JSON with a default fallback.
 * @param json - JSON string to parse.
 * @param fallback - Fallback value if parsing fails.
 */
export function safeJsonParse<T>(json: string | null, fallback: T): T {
    if (!json) return fallback;
    try {
        return JSON.parse(json) as T;
    } catch (error) {
        console.error('JSON Parse Error:', error);
        return fallback;
    }
}
