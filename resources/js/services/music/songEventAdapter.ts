/**
 * Song Event Adapter
 * Converts database SongEvent[] into the game's ChordEvent[]/NoteEvent[]/SectionEvent[].
 *
 * Color palette and lane assignment are derived from the chord name so that
 * the same chord always shows in the same lane/color across the song.
 */

import type { SongEvent } from '@/types/music';
import type { ChordEvent, NoteEvent, SectionEvent } from '@/types/musicGame';

const CHORD_COLORS = [
  '#79C928', // green
  '#009FE3', // blue
  '#F6A800', // orange
  '#B824F5', // purple
];

const NOTE_COLOR_BY_FRET: Record<string, string> = {
  '0': '#A5A5A5',
  '1': '#F6A800',
  '2': '#F6A800',
  '3': '#F6A800',
  '4': '#009FE3',
  '5': '#009FE3',
  '6': '#009FE3',
  '7': '#B824F5',
};

/**
 * Hash a chord name to a stable lane index (0..3).
 */
function laneForChord(chord: string, fallbackIndex: number): number {
  if (!chord) {
    return fallbackIndex % 4;
  }

  // Use the first two chars (root + accidental) for stability.
  const key = chord.slice(0, 2);
  let hash = 0;

  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }

  return hash % 4;
}

/**
 * Pick a stable color for a chord based on its lane.
 */
function colorForChord(chord: string, fallbackIndex: number): string {
  const lane = laneForChord(chord, fallbackIndex);
  return CHORD_COLORS[lane];
}

/**
 * Pick a stable color for a note based on its fret number.
 */
function colorForNote(fret: string): string {
  return NOTE_COLOR_BY_FRET[fret] ?? '#A5A5A5';
}

/**
 * Treat events on track 1 as chord blocks, the rest as note capsules.
 * If a song has no "track" field convention, everything becomes a chord block.
 */
function isChordTrack(event: SongEvent): boolean {
  // No explicit notes array means we render a chord block.
  if (!event.notes || event.notes.length === 0) {
    return true;
  }

  // Track 1 is conventionally the rhythm/chord track.
  return event.track === 1;
}

/**
 * Convert raw SongEvent[] into ChordEvent[] for the highway.
 */
export function toChordEvents(events: SongEvent[]): ChordEvent[] {
  return events.filter(isChordTrack).map((event, index) => ({
    id: event.id,
    type: 'chord',
    label: event.chord,
    startTime: event.start_time,
    duration: event.duration || 1,
    color: colorForChord(event.chord, index),
    lane: laneForChord(event.chord, index),
  }));
}

/**
 * Convert raw SongEvent[] into NoteEvent[] (small capsule notes on string lanes).
 */
export function toNoteEvents(events: SongEvent[]): NoteEvent[] {
  const result: NoteEvent[] = [];

  events.forEach((event) => {
    if (isChordTrack(event)) {
      return;
    }

    // For melody/lead tracks, derive a fret/string from finger info when available.
    const fret = event.finger_positions?.[0]?.fret?.toString() ?? '0';
    const stringIndex = (event.finger_positions?.[0]?.string ?? 0) + 1;

    result.push({
      id: event.id + 100000, // offset to avoid collisions with chord ids
      type: 'note',
      fret,
      string: Math.max(1, Math.min(6, stringIndex)),
      startTime: event.start_time,
      duration: event.duration || 0.6,
      color: colorForNote(fret),
    });
  });

  return result;
}

/**
 * Derive section labels from the song duration if the song doesn't expose any.
 * Splits the song into Intro / Verse / Chorus thirds.
 */
export function deriveSections(duration: number): SectionEvent[] {
  if (duration <= 0) {
    return [];
  }

  const third = duration / 3;

  return [
    { id: 1, label: 'Intro', startTime: 0, duration: third },
    { id: 2, label: 'Verse', startTime: third, duration: third },
    { id: 3, label: 'Chorus', startTime: third * 2, duration: third },
  ];
}
