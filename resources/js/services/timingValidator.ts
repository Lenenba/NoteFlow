/**
 * Timing Validator Service
 * Validates timing and chord accuracy for practice sessions
 */

import type { SongEvent } from '@/types/music';

export type FeedbackType = 'perfect' | 'good' | 'early' | 'late' | 'wrong' | 'miss';

export interface ValidationResult {
    feedback: FeedbackType;
    score: number;
    timingOffset: number;
    expectedChord: string;
    playedChord: string;
    eventId: number;
}

export class TimingValidator {
    // Timing windows in seconds
    private static readonly PERFECT_WINDOW = 0.05; // ±50ms
    private static readonly GOOD_WINDOW = 0.15;    // ±150ms
    private static readonly EARLY_WINDOW = 0.3;    // -300ms
    private static readonly LATE_WINDOW = 0.3;     // +300ms

    // Score values
    private static readonly PERFECT_SCORE = 100;
    private static readonly GOOD_SCORE = 75;
    private static readonly EARLY_SCORE = 50;
    private static readonly LATE_SCORE = 50;
    private static readonly WRONG_SCORE = 0;
    private static readonly MISS_SCORE = 0;

    /**
     * Validate a played chord against expected events
     */
    static validate(
        events: SongEvent[],
        currentTime: number,
        playedChord: string
    ): ValidationResult | null {
        // Find the closest event within timing windows
        let closestEvent: SongEvent | null = null;
        let closestOffset = Infinity;

        for (const event of events) {
            const offset = currentTime - event.start_time;
            const absOffset = Math.abs(offset);

            // Check if within any timing window
            if (absOffset <= this.LATE_WINDOW || offset >= -this.EARLY_WINDOW) {
                if (absOffset < Math.abs(closestOffset)) {
                    closestEvent = event;
                    closestOffset = offset;
                }
            }
        }

        if (!closestEvent) {
            return null;
        }

        // Determine feedback based on timing and chord match
        const chordMatches = this.chordsMatch(closestEvent.chord, playedChord);
        const absOffset = Math.abs(closestOffset);

        let feedback: FeedbackType;
        let score: number;

        if (!chordMatches) {
            feedback = 'wrong';
            score = this.WRONG_SCORE;
        } else if (absOffset <= this.PERFECT_WINDOW) {
            feedback = 'perfect';
            score = this.PERFECT_SCORE;
        } else if (absOffset <= this.GOOD_WINDOW) {
            feedback = 'good';
            score = this.GOOD_SCORE;
        } else if (closestOffset < 0) {
            feedback = 'early';
            score = this.EARLY_SCORE;
        } else {
            feedback = 'late';
            score = this.LATE_SCORE;
        }

        return {
            feedback,
            score,
            timingOffset: closestOffset,
            expectedChord: closestEvent.chord,
            playedChord,
            eventId: closestEvent.id,
        };
    }

    /**
     * Check if two chords match (with some flexibility)
     */
    private static chordsMatch(expected: string, played: string): boolean {
        // Exact match
        if (expected === played) {
            return true;
        }

        // Normalize chords (remove spaces, convert to uppercase)
        const normalizedExpected = expected.replace(/\s/g, '').toUpperCase();
        const normalizedPlayed = played.replace(/\s/g, '').toUpperCase();

        if (normalizedExpected === normalizedPlayed) {
            return true;
        }

        // Check for enharmonic equivalents (e.g., C# = Db)
        const enharmonicMap: Record<string, string[]> = {
            'C#': ['DB'],
            'D#': ['EB'],
            'F#': ['GB'],
            'G#': ['AB'],
            'A#': ['BB'],
        };

        for (const [key, equivalents] of Object.entries(enharmonicMap)) {
            if (normalizedExpected.startsWith(key) && equivalents.some(eq => normalizedPlayed.startsWith(eq))) {
                return true;
            }

            if (normalizedPlayed.startsWith(key) && equivalents.some(eq => normalizedExpected.startsWith(eq))) {
                return true;
            }
        }

        return false;
    }

    /**
     * Calculate accuracy from validation results
     */
    static calculateAccuracy(results: ValidationResult[]): number {
        if (results.length === 0) {
            return 100;
        }

        const successfulHits = results.filter(
            r => r.feedback === 'perfect' || r.feedback === 'good'
        ).length;

        return (successfulHits / results.length) * 100;
    }

    /**
     * Calculate max streak from validation results
     */
    static calculateMaxStreak(results: ValidationResult[]): number {
        let maxStreak = 0;
        let currentStreak = 0;

        for (const result of results) {
            if (result.feedback === 'perfect' || result.feedback === 'good') {
                currentStreak++;
                maxStreak = Math.max(maxStreak, currentStreak);
            } else {
                currentStreak = 0;
            }
        }

        return maxStreak;
    }

    /**
     * Check if an event was missed
     */
    static checkMiss(event: SongEvent, currentTime: number): boolean {
        const eventEnd = event.start_time + event.duration;
        const missWindow = eventEnd + this.LATE_WINDOW;

        return currentTime > missWindow;
    }

    /**
     * Get timing feedback text
     */
    static getFeedbackText(feedback: FeedbackType): string {
        const feedbackTexts: Record<FeedbackType, string> = {
            perfect: 'Perfect!',
            good: 'Good',
            early: 'Early',
            late: 'Late',
            wrong: 'Wrong',
            miss: 'Miss',
        };

        return feedbackTexts[feedback];
    }

    /**
     * Get timing feedback color
     */
    static getFeedbackColor(feedback: FeedbackType): string {
        const feedbackColors: Record<FeedbackType, string> = {
            perfect: '#10b981', // green
            good: '#3b82f6',    // blue
            early: '#f59e0b',   // amber
            late: '#f59e0b',    // amber
            wrong: '#ef4444',   // red
            miss: '#6b7280',    // gray
        };

        return feedbackColors[feedback];
    }

    /**
     * Get detailed feedback message with timing offset
     */
    static getFeedbackMessage(feedback: FeedbackType, timingOffset: number): string {
        const offsetMs = Math.abs(Math.round(timingOffset * 1000));

        switch (feedback) {
            case 'perfect':
                return 'Perfect!';
            case 'good':
                return 'Good';
            case 'early':
                return `Early (${offsetMs}ms)`;
            case 'late':
                return `Late (${offsetMs}ms)`;
            case 'wrong':
                return 'Wrong Chord';
            case 'miss':
                return 'Missed';
            default:
                return '';
        }
    }
}

// Made with Bob
