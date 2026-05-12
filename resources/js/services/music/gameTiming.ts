/**
 * Game Timing Service
 * Pure helpers for game state initialization, time updates,
 * combo multiplier mapping, scoring rules and number formatting.
 */

import type { FeedbackEvent, GameState } from '@/types/musicGame';

/**
 * Build the default game state used on mount and on restart.
 */
export function createInitialGameState(): GameState {
  return {
    isPlaying: false,
    isPaused: false,
    currentTime: 0,
    score: 0,
    combo: 0,
    maxCombo: 0,
    speed: 1,
    autoSpeed: false,
    metronome: false,
    guitarSound: true,
    leftHanded: false,
  };
}

/**
 * Map a raw combo count to a visible combo multiplier (1x..10x).
 */
export function getComboMultiplier(combo: number): number {
  if (combo < 5) {
    return 1;
  }

  if (combo < 10) {
    return 2;
  }

  if (combo < 20) {
    return 3;
  }

  if (combo < 50) {
    return 5;
  }

  return 10;
}

/**
 * Score awarded for a given feedback, multiplied by the current combo multiplier.
 */
export function getPointsForFeedback(
  type: FeedbackEvent['type'],
  combo: number,
): number {
  const multiplier = getComboMultiplier(combo);

  switch (type) {
    case 'Perfect':
      return 100 * multiplier;
    case 'Good':
      return 75 * multiplier;
    case 'Late':
      return 50 * multiplier;
    case 'Wrong':
      return 0;
    case 'Miss':
      return 0;
    default:
      return 0;
  }
}

/**
 * Increment a combo counter (capped at a large value to avoid overflow).
 */
export function incrementCombo(combo: number): number {
  return Math.min(combo + 1, 9999);
}

/**
 * Reset the combo when a Wrong/Miss happens.
 */
export function resetCombo(): number {
  return 0;
}

/**
 * Advance the game clock by `deltaTime` ms, scaled by the playback speed.
 * The function is no-op when the game is not playing.
 */
export function updateGameTime(
  currentTime: number,
  deltaTimeMs: number,
  speed: number,
  isPlaying: boolean,
): number {
  if (!isPlaying) {
    return currentTime;
  }

  return currentTime + (deltaTimeMs / 1000) * speed;
}

/**
 * Format a score as "19 050" (space as thousands separator).
 */
export function formatScore(score: number): string {
  const rounded = Math.max(0, Math.floor(score));
  return rounded
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/**
 * Format a time in seconds as "M:SS".
 */
export function formatTime(seconds: number): string {
  const safe = Math.max(0, seconds);
  const minutes = Math.floor(safe / 60);
  const remaining = Math.floor(safe % 60);
  return `${minutes}:${remaining.toString().padStart(2, '0')}`;
}
