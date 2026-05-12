/**
 * Piano Keyboard Diagram Component
 * Displays piano keys with highlighted notes and fingering
 */

import { cn } from '@/lib/utils';

import type { PianoChordDiagram } from '@/data/chordDiagrams';

interface PianoDiagramProps {
    chord: string;
    diagram: PianoChordDiagram;
    size?: 'sm' | 'md' | 'lg';
}

const SIZES = {
    sm: { whiteKeyWidth: 20, whiteKeyHeight: 80, blackKeyWidth: 12, blackKeyHeight: 50 },
    md: { whiteKeyWidth: 30, whiteKeyHeight: 120, blackKeyWidth: 18, blackKeyHeight: 75 },
    lg: { whiteKeyWidth: 40, whiteKeyHeight: 160, blackKeyWidth: 24, blackKeyHeight: 100 },
};

// MIDI note 60 = C4 (middle C)
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function isBlackKey(note: number): boolean {
    const noteInOctave = note % 12;

    return [1, 3, 6, 8, 10].includes(noteInOctave); // C#, D#, F#, G#, A#
}

function getNoteName(midiNote: number): string {
    const octave = Math.floor(midiNote / 12) - 1;
    const noteName = NOTE_NAMES[midiNote % 12];

    return `${noteName}${octave}`;
}

export default function PianoDiagram({ chord, diagram, size = 'md' }: PianoDiagramProps) {
    const { whiteKeyWidth, whiteKeyHeight, blackKeyWidth, blackKeyHeight } = SIZES[size];

    // Display 2 octaves centered around the chord
    const minNote = Math.min(...diagram.notes) - 5;
    const maxNote = Math.max(...diagram.notes) + 7;

    // Generate all notes in range
    const allNotes = Array.from({ length: maxNote - minNote + 1 }, (_, i) => minNote + i);

    // Separate white and black keys
    const whiteKeys = allNotes.filter((note) => !isBlackKey(note));
    const blackKeys = allNotes.filter((note) => isBlackKey(note));

    const totalWidth = whiteKeys.length * whiteKeyWidth;

    // Get position for black keys
    const getBlackKeyPosition = (note: number): number => {
        const whiteKeysBefore = allNotes.filter((n) => n < note && !isBlackKey(n)).length;

        return whiteKeysBefore * whiteKeyWidth - blackKeyWidth / 2;
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="text-sm font-semibold">{chord}</div>
            <svg width={totalWidth + 20} height={whiteKeyHeight + 40} className="bg-background">
                <g transform="translate(10, 10)">
                    {/* Draw white keys */}
                    {whiteKeys.map((note, index) => {
                        const isHighlighted = diagram.notes.includes(note);
                        const fingerIndex = diagram.notes.indexOf(note);
                        const finger = fingerIndex >= 0 ? diagram.fingers[fingerIndex] : null;
                        const x = index * whiteKeyWidth;

                        return (
                            <g key={`white-${note}`}>
                                <rect
                                    x={x}
                                    y={0}
                                    width={whiteKeyWidth}
                                    height={whiteKeyHeight}
                                    fill={isHighlighted ? 'currentColor' : 'white'}
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    className={cn(
                                        isHighlighted ? 'fill-primary' : 'fill-background',
                                        'stroke-foreground/40'
                                    )}
                                />
                                {/* Note name */}
                                <text
                                    x={x + whiteKeyWidth / 2}
                                    y={whiteKeyHeight - 10}
                                    className={cn(
                                        'text-xs',
                                        isHighlighted ? 'fill-primary-foreground' : 'fill-muted-foreground'
                                    )}
                                    textAnchor="middle"
                                >
                                    {getNoteName(note)}
                                </text>
                                {/* Finger number */}
                                {finger && (
                                    <g>
                                        <circle
                                            cx={x + whiteKeyWidth / 2}
                                            cy={whiteKeyHeight - 35}
                                            r={10}
                                            fill="currentColor"
                                            className="fill-primary"
                                        />
                                        <text
                                            x={x + whiteKeyWidth / 2}
                                            y={whiteKeyHeight - 35}
                                            className="fill-primary-foreground text-xs font-bold"
                                            textAnchor="middle"
                                            dominantBaseline="central"
                                        >
                                            {finger}
                                        </text>
                                    </g>
                                )}
                            </g>
                        );
                    })}

                    {/* Draw black keys on top */}
                    {blackKeys.map((note) => {
                        const isHighlighted = diagram.notes.includes(note);
                        const fingerIndex = diagram.notes.indexOf(note);
                        const finger = fingerIndex >= 0 ? diagram.fingers[fingerIndex] : null;
                        const x = getBlackKeyPosition(note);

                        return (
                            <g key={`black-${note}`}>
                                <rect
                                    x={x}
                                    y={0}
                                    width={blackKeyWidth}
                                    height={blackKeyHeight}
                                    fill={isHighlighted ? 'currentColor' : 'black'}
                                    stroke="currentColor"
                                    strokeWidth={1}
                                    className={cn(
                                        isHighlighted ? 'fill-primary' : 'fill-foreground',
                                        'stroke-foreground/60'
                                    )}
                                />
                                {/* Finger number */}
                                {finger && (
                                    <g>
                                        <circle
                                            cx={x + blackKeyWidth / 2}
                                            cy={blackKeyHeight - 15}
                                            r={8}
                                            fill="currentColor"
                                            className="fill-primary"
                                        />
                                        <text
                                            x={x + blackKeyWidth / 2}
                                            y={blackKeyHeight - 15}
                                            className="fill-primary-foreground text-xs font-bold"
                                            textAnchor="middle"
                                            dominantBaseline="central"
                                        >
                                            {finger}
                                        </text>
                                    </g>
                                )}
                            </g>
                        );
                    })}
                </g>
            </svg>

            {/* Finger legend */}
            <div className="text-xs text-muted-foreground">
                <div className="flex gap-2">
                    <span>1=Thumb</span>
                    <span>2=Index</span>
                    <span>3=Middle</span>
                    <span>4=Ring</span>
                    <span>5=Pinky</span>
                </div>
            </div>
        </div>
    );
}

// Made with Bob
