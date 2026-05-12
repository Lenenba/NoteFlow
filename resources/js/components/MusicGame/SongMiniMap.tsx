/**
 * Song Mini Map Component
 * Dense timeline at the bottom of the screen showing every chord/note event
 * as a colored vertical bar, with a bright marker for the current playhead.
 */

import { useMemo } from 'react';

import type { GameEvent } from '@/types/musicGame';

interface SongMiniMapProps {
  events: GameEvent[];
  currentTime: number;
  duration: number;
}

interface Slot {
  position: number;
  color: string;
  height: number;
}

/**
 * Build a dense set of vertical bars covering the whole song duration.
 * Real events get their actual color; the in-between gaps are filled
 * with lower-intensity bars to make the timeline feel "rich" like in the reference.
 */
function buildSlots(events: GameEvent[], duration: number): Slot[] {
  if (duration <= 0) {
    return [];
  }

  // 1) Strong bars at the real event positions.
  const real: Slot[] = events.map((event) => ({
    position: (event.startTime / duration) * 100,
    color: event.color,
    height: 100,
  }));

  // 2) Fill-in bars every ~0.3s of song time, using a darker tint by default.
  const filler: Slot[] = [];
  const totalSlots = Math.min(180, Math.max(40, Math.round(duration * 3)));

  for (let i = 0; i < totalSlots; i++) {
    const position = (i / totalSlots) * 100;
    const nearReal = real.some((r) => Math.abs(r.position - position) < 0.6);

    if (nearReal) {
      continue;
    }

    filler.push({
      position,
      color: 'rgba(255, 255, 255, 0.18)',
      height: 30 + ((i * 47) % 50),
    });
  }

  return [...filler, ...real];
}

export function SongMiniMap({ events, currentTime, duration }: SongMiniMapProps) {
  const slots = useMemo(() => buildSlots(events, duration), [events, duration]);
  const progress = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 w-[60%] max-w-2xl -translate-x-1/2">
      <div className="relative h-7 overflow-hidden rounded-full bg-black/70 backdrop-blur-sm shadow-lg">
        {/* Vertical bars representing events and filler */}
        <div className="absolute inset-0">
          {slots.map((slot, idx) => (
            <div
              key={idx}
              className="absolute top-1/2 -translate-y-1/2 rounded-sm"
              style={{
                left: `${slot.position}%`,
                width: 2,
                height: `${slot.height}%`,
                backgroundColor: slot.color,
                opacity: slot.position <= progress ? 1 : 0.85,
              }}
            />
          ))}
        </div>

        {/* Past-progress dimmer overlay */}
        <div
          className="absolute top-0 left-0 h-full bg-black/30"
          style={{ width: `${progress}%` }}
        />

        {/* Playhead marker */}
        <div
          className="absolute top-0 h-full w-[3px] -translate-x-1/2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]"
          style={{ left: `${progress}%` }}
        />
      </div>
    </div>
  );
}
