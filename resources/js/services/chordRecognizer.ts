/**
 * Chord Recognition Service
 * Recognizes chords from MIDI note numbers
 */

interface ChordMatch {
    chord: string;
    confidence: number;
}

export class ChordRecognizer {
    private static readonly CHORD_PATTERNS: Record<string, number[]> = {
        // Major chords
        'C': [0, 4, 7],
        'D': [2, 6, 9],
        'E': [4, 8, 11],
        'F': [5, 9, 0],
        'G': [7, 11, 2],
        'A': [9, 1, 4],
        'B': [11, 3, 6],

        // Minor chords
        'Cm': [0, 3, 7],
        'Dm': [2, 5, 9],
        'Em': [4, 7, 11],
        'Fm': [5, 8, 0],
        'Gm': [7, 10, 2],
        'Am': [9, 0, 4],
        'Bm': [11, 2, 6],

        // Seventh chords
        'C7': [0, 4, 7, 10],
        'D7': [2, 6, 9, 0],
        'E7': [4, 8, 11, 2],
        'F7': [5, 9, 0, 3],
        'G7': [7, 11, 2, 5],
        'A7': [9, 1, 4, 7],
        'B7': [11, 3, 6, 9],
    };

    /**
     * Recognize chord from MIDI note numbers
     */
    static recognizeChord(noteNumbers: number[]): ChordMatch | null {
        if (noteNumbers.length < 2) {
            return null;
        }

        // Normalize notes to pitch classes (0-11)
        const pitchClasses = noteNumbers.map(n => n % 12).sort((a, b) => a - b);

        // Remove duplicates
        const uniquePitches = Array.from(new Set(pitchClasses));

        // Try to match against known patterns
        let bestMatch: ChordMatch | null = null;
        let bestConfidence = 0;

        for (const [chordName, pattern] of Object.entries(this.CHORD_PATTERNS)) {
            const confidence = this.calculateMatchConfidence(uniquePitches, pattern);

            if (confidence > bestConfidence && confidence > 0.6) {
                bestConfidence = confidence;
                bestMatch = {
                    chord: chordName,
                    confidence
                };
            }
        }

        return bestMatch;
    }

    /**
     * Calculate how well the played notes match a chord pattern
     */
    private static calculateMatchConfidence(played: number[], pattern: number[]): number {
        if (played.length === 0 || pattern.length === 0) {
            return 0;
        }

        const matchedNotes = played.filter(note => pattern.includes(note)).length;
        const extraNotes = played.length - matchedNotes;
        const missingNotes = pattern.length - matchedNotes;

        // Perfect match
        if (matchedNotes === pattern.length && extraNotes === 0) {
            return 1.0;
        }

        // Calculate confidence based on matches and penalties
        const matchScore = matchedNotes / pattern.length;
        const extraPenalty = extraNotes * 0.1;
        const missingPenalty = missingNotes * 0.15;

        return Math.max(0, matchScore - extraPenalty - missingPenalty);
    }
}

// Made with Bob
