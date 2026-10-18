import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Extracts 1-2 uppercase initials from a person's name, stripping Indonesian honorific titles.
 * @param name Full name with potential honorifics (e.g. "H. Daritaniansyah, S.E.")
 * @param fallback Fallback string if no letters found (default: "DW")
 */
export function getInitials(name: string, fallback = 'DW'): string {
  const clean = name.replace(/^(H\.|Dr\.|Hj\.|Drs\.|Ir\.|M\.)\s*/gi, '').trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase() || fallback;
}
