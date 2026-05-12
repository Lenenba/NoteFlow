/**
 * Music Game Type Definitions
 * All interfaces for the interactive music practice game
 */

export interface ChordEvent {
  id: number;
  type: 'chord';
  label: string;
  startTime: number;
  duration: number;
  color: string;
  lane: number;
}

export interface NoteEvent {
  id: number;
  type: 'note';
  fret: string;
  string: number;
  startTime: number;
  duration: number;
  color: string;
}

export interface SectionEvent {
  id: number;
  label: string;
  startTime: number;
  duration: number;
}

export interface FeedbackEvent {
  id: number;
  type: 'Perfect' | 'Good' | 'Late' | 'Wrong' | 'Miss';
  timestamp: number;
  x: number;
  y: number;
  scale: number;
  opacity: number;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  lifetime: number;
  age: number;
}

export interface GameState {
  isPlaying: boolean;
  isPaused: boolean;
  currentTime: number;
  score: number;
  combo: number;
  maxCombo: number;
  speed: number;
  autoSpeed: boolean;
  metronome: boolean;
  guitarSound: boolean;
  leftHanded: boolean;
}

export interface GameTheme {
  // Background colors
  bgTopColor: string;
  bgBottomColor: string;
  accentColor: string;

  // Fretboard colors
  fretboardDark: string;
  fretboardMid: string;
  stringColor: string;
  gridColor: string;

  // Chord colors
  blueChord: string;
  orangeChord: string;
  purpleChord: string;
  greenChord: string;
  greyChord: string;

  // Feedback colors
  wrongRed: string;
  whiteText: string;
  darkOverlay: string;
}

export interface ProjectionResult {
  y: number;
  scale: number;
  opacity: number;
  depth: number;
  width: number;
  isVisible: boolean;
}

export interface HighwayLayout {
  farY: number;
  hitLineY: number;
  farWidth: number;
  nearWidth: number;
  stringCount: number;
}

export interface SongData {
  title: string;
  bpm: number;
  sections: SectionEvent[];
  chords: ChordEvent[];
  notes: NoteEvent[];
  duration: number;
}

export type GameEvent = ChordEvent | NoteEvent;

// Made with Bob
