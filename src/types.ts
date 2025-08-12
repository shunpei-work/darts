/**
 * Type definitions for the Round Details Sidebar feature
 */

/**
 * Represents the details of a single score (dart throw)
 */
export interface ScoreDetail {
  /** The actual score value (20, 40, 60, etc.) */
  value: number;
  /** The base number on the dartboard (20, 15, 10, etc.) */
  baseNumber: number;
  /** The multiplier type: Single, Double, or Triple */
  multiplier: 'S' | 'D' | 'T';
}

/**
 * Represents the complete details of a single round
 */
export interface RoundDetail {
  /** The round number (1, 2, 3, etc.) */
  roundNumber: number;
  /** Array of individual score details for this round (up to 3 throws) */
  scores: ScoreDetail[];
  /** Total score for this round */
  total: number;
}