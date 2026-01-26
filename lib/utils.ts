import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRoundName(round: number): string {
  const roundNames: Record<number, string> = {
    1: 'Round of 64',
    2: 'Round of 32',
    3: 'Round of 16',
    4: 'Quarterfinals',
    5: 'Semifinals',
    6: 'Final',
  };
  return roundNames[round] || `Round ${round}`;
}

export function getNextRound(round: number): number | null {
  if (round >= 6) return null; // Tournament ends at round 6 (Final)
  return round + 1;
}

export function getRoundSize(round: number): number {
  const sizes: Record<number, number> = {
    1: 64,
    2: 32,
    3: 16,
    4: 8,
    5: 4,
    6: 2, // Final - 2 videos compete
  };
  return sizes[round] || 0;
}
