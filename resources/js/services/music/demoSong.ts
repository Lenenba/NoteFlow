/**
 * Demo Song and Game Theme
 * Static data used when no real song is provided (e.g. /music-practice/demo).
 */

import type { ChordEvent, GameTheme, NoteEvent, SectionEvent, SongData } from '@/types/musicGame';

export const gameTheme: GameTheme = {
  // Background colors
  bgTopColor: '#B8F34A',
  bgBottomColor: '#8FD728',
  accentColor: '#79C928',

  // Fretboard colors
  fretboardDark: '#242826',
  fretboardMid: '#343836',
  stringColor: '#D9D9D9',
  gridColor: 'rgba(160, 255, 80, 0.35)',

  // Chord colors
  blueChord: '#009FE3',
  orangeChord: '#F6A800',
  purpleChord: '#B824F5',
  greenChord: '#79C928',
  greyChord: '#A5A5A5',

  // Feedback colors
  wrongRed: '#FF4E4E',
  whiteText: '#FFFFFF',
  darkOverlay: 'rgba(0, 0, 0, 0.25)',
};

const sections: SectionEvent[] = [
  { id: 1, label: 'Interlude', startTime: 0, duration: 8 },
  { id: 2, label: 'Verse', startTime: 8, duration: 16 },
  { id: 3, label: 'Chorus 1', startTime: 24, duration: 16 },
];

const chords: ChordEvent[] = [
  { id: 1, type: 'chord', label: 'A', startTime: 2, duration: 1.8, color: '#79C928', lane: 0 },
  { id: 2, type: 'chord', label: 'D', startTime: 5, duration: 1.5, color: '#009FE3', lane: 1 },
  { id: 3, type: 'chord', label: 'E', startTime: 8, duration: 1.5, color: '#F6A800', lane: 2 },
  { id: 4, type: 'chord', label: 'A', startTime: 11, duration: 1.8, color: '#B824F5', lane: 3 },
  { id: 5, type: 'chord', label: 'D', startTime: 15, duration: 1.5, color: '#009FE3', lane: 1 },
  { id: 6, type: 'chord', label: 'Em', startTime: 18, duration: 2, color: '#F6A800', lane: 2 },
  { id: 7, type: 'chord', label: 'G', startTime: 22, duration: 1.5, color: '#79C928', lane: 0 },
  { id: 8, type: 'chord', label: 'C', startTime: 26, duration: 1.5, color: '#009FE3', lane: 1 },
];

const notes: NoteEvent[] = [
  { id: 101, type: 'note', fret: '0', string: 5, startTime: 3.2, duration: 0.6, color: '#A5A5A5' },
  { id: 102, type: 'note', fret: '2', string: 4, startTime: 4.0, duration: 0.6, color: '#F6A800' },
  { id: 103, type: 'note', fret: '3', string: 3, startTime: 4.8, duration: 0.6, color: '#F6A800' },
  { id: 104, type: 'note', fret: '5', string: 2, startTime: 6.0, duration: 0.9, color: '#009FE3' },
  { id: 105, type: 'note', fret: '7', string: 1, startTime: 10.5, duration: 0.8, color: '#E46D4F' },
  { id: 106, type: 'note', fret: '5', string: 2, startTime: 11.4, duration: 0.8, color: '#E46D4F' },
  { id: 107, type: 'note', fret: '3', string: 3, startTime: 12.3, duration: 0.8, color: '#F6A800' },
  { id: 108, type: 'note', fret: '0', string: 5, startTime: 13.2, duration: 0.7, color: '#A5A5A5' },
];

export const demoSong: SongData = {
  title: 'Beginner Chord Highway',
  bpm: 90,
  sections,
  chords,
  notes,
  duration: 40,
};
