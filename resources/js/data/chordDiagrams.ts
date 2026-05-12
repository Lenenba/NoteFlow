/**
 * Chord Diagrams Data - Fingering positions for different instruments
 */

// Guitar chord diagrams (6 strings, frets 0-12)
// Format: [string6, string5, string4, string3, string2, string1]
// -1 = don't play, 0 = open string, 1-12 = fret number
export interface GuitarChordDiagram {
    frets: number[]; // 6 strings from low E to high E
    fingers: number[]; // Finger numbers (0=open, 1=index, 2=middle, 3=ring, 4=pinky)
    baseFret: number; // Starting fret for the diagram
    barres?: [number, number, number][]; // Barre positions [fret, startString, endString]
}

export const GUITAR_CHORDS: Record<string, GuitarChordDiagram> = {
    // Major chords
    'C': { frets: [-1, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0], baseFret: 1 },
    'D': { frets: [-1, -1, 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2], baseFret: 1 },
    'E': { frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0], baseFret: 1 },
    'F': { frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1], baseFret: 1, barres: [[1, 1, 6]] },
    'G': { frets: [3, 2, 0, 0, 0, 3], fingers: [3, 2, 0, 0, 0, 4], baseFret: 1 },
    'A': { frets: [-1, 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0], baseFret: 1 },
    'B': { frets: [-1, 2, 4, 4, 4, 2], fingers: [0, 1, 3, 3, 3, 1], baseFret: 1, barres: [[2, 2, 6]] },

    // Minor chords
    'Cm': { frets: [-1, 3, 5, 5, 4, 3], fingers: [0, 1, 3, 4, 2, 1], baseFret: 1, barres: [[3, 2, 6]] },
    'Dm': { frets: [-1, -1, 0, 2, 3, 1], fingers: [0, 0, 0, 2, 3, 1], baseFret: 1 },
    'Em': { frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0], baseFret: 1 },
    'Fm': { frets: [1, 3, 3, 1, 1, 1], fingers: [1, 3, 4, 1, 1, 1], baseFret: 1, barres: [[1, 1, 6]] },
    'Gm': { frets: [3, 5, 5, 3, 3, 3], fingers: [1, 3, 4, 1, 1, 1], baseFret: 1, barres: [[3, 1, 6]] },
    'Am': { frets: [-1, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0], baseFret: 1 },
    'Bm': { frets: [-1, 2, 4, 4, 3, 2], fingers: [0, 1, 3, 4, 2, 1], baseFret: 1, barres: [[2, 2, 6]] },

    // 7th chords
    'C7': { frets: [-1, 3, 2, 3, 1, 0], fingers: [0, 3, 2, 4, 1, 0], baseFret: 1 },
    'D7': { frets: [-1, -1, 0, 2, 1, 2], fingers: [0, 0, 0, 2, 1, 3], baseFret: 1 },
    'E7': { frets: [0, 2, 0, 1, 0, 0], fingers: [0, 2, 0, 1, 0, 0], baseFret: 1 },
    'G7': { frets: [3, 2, 0, 0, 0, 1], fingers: [3, 2, 0, 0, 0, 1], baseFret: 1 },
    'A7': { frets: [-1, 0, 2, 0, 2, 0], fingers: [0, 0, 2, 0, 3, 0], baseFret: 1 },
};

// Piano key positions for chords
// Format: array of MIDI note numbers
export interface PianoChordDiagram {
    notes: number[]; // MIDI note numbers (C4 = 60)
    fingers: number[]; // Suggested fingering (1=thumb, 2=index, 3=middle, 4=ring, 5=pinky)
    hand: 'left' | 'right' | 'both';
}

export const PIANO_CHORDS: Record<string, PianoChordDiagram> = {
    // Major chords (root position)
    'C': { notes: [60, 64, 67], fingers: [1, 3, 5], hand: 'right' }, // C-E-G
    'D': { notes: [62, 66, 69], fingers: [1, 3, 5], hand: 'right' }, // D-F#-A
    'E': { notes: [64, 68, 71], fingers: [1, 3, 5], hand: 'right' }, // E-G#-B
    'F': { notes: [65, 69, 72], fingers: [1, 3, 5], hand: 'right' }, // F-A-C
    'G': { notes: [67, 71, 74], fingers: [1, 3, 5], hand: 'right' }, // G-B-D
    'A': { notes: [69, 73, 76], fingers: [1, 3, 5], hand: 'right' }, // A-C#-E
    'B': { notes: [71, 75, 78], fingers: [1, 3, 5], hand: 'right' }, // B-D#-F#

    // Minor chords
    'Cm': { notes: [60, 63, 67], fingers: [1, 2, 5], hand: 'right' }, // C-Eb-G
    'Dm': { notes: [62, 65, 69], fingers: [1, 2, 5], hand: 'right' }, // D-F-A
    'Em': { notes: [64, 67, 71], fingers: [1, 2, 5], hand: 'right' }, // E-G-B
    'Fm': { notes: [65, 68, 72], fingers: [1, 2, 5], hand: 'right' }, // F-Ab-C
    'Gm': { notes: [67, 70, 74], fingers: [1, 2, 5], hand: 'right' }, // G-Bb-D
    'Am': { notes: [69, 72, 76], fingers: [1, 2, 5], hand: 'right' }, // A-C-E
    'Bm': { notes: [71, 74, 78], fingers: [1, 2, 5], hand: 'right' }, // B-D-F#

    // 7th chords
    'C7': { notes: [60, 64, 67, 70], fingers: [1, 2, 3, 5], hand: 'right' }, // C-E-G-Bb
    'D7': { notes: [62, 66, 69, 72], fingers: [1, 2, 3, 5], hand: 'right' }, // D-F#-A-C
    'E7': { notes: [64, 68, 71, 74], fingers: [1, 2, 3, 5], hand: 'right' }, // E-G#-B-D
    'G7': { notes: [67, 71, 74, 77], fingers: [1, 2, 3, 5], hand: 'right' }, // G-B-D-F
    'A7': { notes: [69, 73, 76, 79], fingers: [1, 2, 3, 5], hand: 'right' }, // A-C#-E-G
};

// Drum patterns for common rhythms
export interface DrumPattern {
    name: string;
    instruments: string[]; // Kick, Snare, Hi-hat, etc.
    pattern: number[][]; // [time, instrument_index, velocity]
    tempo: number;
}

export const DRUM_PATTERNS: Record<string, DrumPattern> = {
    'Basic Rock': {
        name: 'Basic Rock Beat',
        instruments: ['Kick', 'Snare', 'Hi-hat'],
        pattern: [
            [0, 0, 100], // Kick
            [0, 2, 80], // Hi-hat
            [0.5, 2, 60], // Hi-hat
            [1, 1, 100], // Snare
            [1, 2, 80], // Hi-hat
            [1.5, 2, 60], // Hi-hat
            [2, 0, 100], // Kick
            [2, 2, 80], // Hi-hat
            [2.5, 2, 60], // Hi-hat
            [3, 1, 100], // Snare
            [3, 2, 80], // Hi-hat
            [3.5, 2, 60], // Hi-hat
        ],
        tempo: 120,
    },
    'Funk': {
        name: 'Funk Groove',
        instruments: ['Kick', 'Snare', 'Hi-hat'],
        pattern: [
            [0, 0, 100],
            [0, 2, 80],
            [0.5, 2, 60],
            [0.75, 0, 80],
            [1, 1, 100],
            [1, 2, 80],
            [1.5, 2, 60],
            [2, 0, 100],
            [2, 2, 80],
            [2.5, 2, 60],
            [3, 1, 100],
            [3, 2, 80],
            [3.5, 0, 80],
            [3.5, 2, 60],
        ],
        tempo: 100,
    },
};

// Bass patterns (simplified - showing root notes and common patterns)
export interface BassPattern {
    root: number; // MIDI note number
    pattern: number[]; // Intervals from root
    rhythm: number[]; // Beat positions (0-4 for 4/4 time)
}

export const BASS_PATTERNS: Record<string, BassPattern> = {
    'C': { root: 36, pattern: [0, 7, 0, 5], rhythm: [0, 1, 2, 3] }, // C root, fifth, root, fourth
    'D': { root: 38, pattern: [0, 7, 0, 5], rhythm: [0, 1, 2, 3] },
    'E': { root: 40, pattern: [0, 7, 0, 5], rhythm: [0, 1, 2, 3] },
    'F': { root: 41, pattern: [0, 7, 0, 5], rhythm: [0, 1, 2, 3] },
    'G': { root: 43, pattern: [0, 7, 0, 5], rhythm: [0, 1, 2, 3] },
    'A': { root: 45, pattern: [0, 7, 0, 5], rhythm: [0, 1, 2, 3] },
    'B': { root: 47, pattern: [0, 7, 0, 5], rhythm: [0, 1, 2, 3] },
};

// Helper function to get chord diagram for current instrument
export function getChordDiagram(chord: string, instrument: 'guitar' | 'piano' | 'drums' | 'bass') {
    switch (instrument) {
        case 'guitar':
            return GUITAR_CHORDS[chord] || null;
        case 'piano':
            return PIANO_CHORDS[chord] || null;
        case 'drums':
            return DRUM_PATTERNS[chord] || null;
        case 'bass':
            return BASS_PATTERNS[chord] || null;
        default:
            return null;
    }
}

// Made with Bob
