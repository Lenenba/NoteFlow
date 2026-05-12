/**
 * Game Projection Service
 * Perspective projection math for the music highway.
 * Converts time distances into screen positions, widths, scales and opacities.
 */

import type { HighwayLayout, ProjectionResult } from '@/types/musicGame';

// How many seconds ahead are visible on the highway.
export const VISIBLE_AHEAD_SECONDS = 10;

// How many seconds after the hit line the block is still shown while fading.
export const VISIBLE_BEHIND_SECONDS = 0.5;

// Vertical positions expressed as ratios of the canvas height.
const HIT_LINE_RATIO = 0.78;
const FAR_RATIO = 0.38;

// Horizontal widths expressed as ratios of the canvas width.
const FAR_WIDTH_RATIO = 0.45;
const NEAR_WIDTH_RATIO = 1.15;

// Default count of strings drawn on the highway.
const DEFAULT_STRING_COUNT = 6;

/**
 * Clamp a value between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  if (value < min) {
    return min;
  }

  if (value > max) {
    return max;
  }

  return value;
}

/**
 * Build a highway layout from the current canvas dimensions.
 */
export function createHighwayLayout(width: number, height: number): HighwayLayout {
  return {
    farY: height * FAR_RATIO,
    hitLineY: height * HIT_LINE_RATIO,
    farWidth: width * FAR_WIDTH_RATIO,
    nearWidth: width * NEAR_WIDTH_RATIO,
    stringCount: DEFAULT_STRING_COUNT,
  };
}

/**
 * Project an event with a given time-to-hit into screen-space attributes.
 * - timeToHit > 0: the event is in the future (far away).
 * - timeToHit == 0: the event sits on the hit line.
 * - timeToHit < 0: the event has passed the hit line.
 */
export function projectEvent(
  timeToHit: number,
  layout: HighwayLayout,
): ProjectionResult {
  // Hide events too far in the future or too far past the hit line.
  if (timeToHit > VISIBLE_AHEAD_SECONDS || timeToHit < -VISIBLE_BEHIND_SECONDS) {
    return {
      y: layout.hitLineY,
      scale: 0,
      opacity: 0,
      depth: 0,
      width: layout.farWidth,
      isVisible: false,
    };
  }

  // Depth grows from 0 at the far end to 1 at the hit line.
  const depth = clamp(1 - timeToHit / VISIBLE_AHEAD_SECONDS, 0, 1);

  const y = layout.farY + depth * (layout.hitLineY - layout.farY);
  const scale = 0.45 + depth * 0.85;

  // Fade in from far away, then fade out quickly after passing the hit line.
  let opacity = 0.35 + depth * 0.65;

  if (timeToHit < 0) {
    const pastFade = clamp(1 + timeToHit / VISIBLE_BEHIND_SECONDS, 0, 1);
    opacity *= pastFade;
  }

  const width = layout.farWidth + depth * (layout.nearWidth - layout.farWidth);

  return {
    y,
    scale,
    opacity,
    depth,
    width,
    isVisible: opacity > 0.01,
  };
}

/**
 * Return the horizontal center X of a given lane (0..laneCount-1) at depth d.
 * Lanes are evenly distributed across the projected highway width.
 */
export function getLaneCenterX(
  centerX: number,
  projectionWidth: number,
  lane: number,
  laneCount: number,
): number {
  const laneWidth = projectionWidth / laneCount;
  return centerX - projectionWidth / 2 + laneWidth * (lane + 0.5);
}

/**
 * Return the horizontal X of a given string (1..stringCount) at depth d.
 * Strings are evenly distributed across the projected highway width.
 */
export function getStringX(
  centerX: number,
  projectionWidth: number,
  stringIndex: number,
  stringCount: number = DEFAULT_STRING_COUNT,
): number {
  const spacing = projectionWidth / (stringCount + 1);
  return centerX - projectionWidth / 2 + spacing * stringIndex;
}
