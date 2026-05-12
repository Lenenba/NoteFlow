/**
 * Guitar Chord Diagram Component
 * Displays guitar fingering with frets, strings, and finger positions
 */

import type { GuitarChordDiagram } from '@/data/chordDiagrams';

interface GuitarDiagramProps {
    chord: string;
    diagram: GuitarChordDiagram;
    size?: 'sm' | 'md' | 'lg';
}

const SIZES = {
    sm: { width: 120, height: 140, fretHeight: 20, stringSpacing: 18 },
    md: { width: 160, height: 180, fretHeight: 25, stringSpacing: 24 },
    lg: { width: 200, height: 220, fretHeight: 30, stringSpacing: 30 },
};

export default function GuitarDiagram({ chord, diagram, size = 'md' }: GuitarDiagramProps) {
    const { width, height, fretHeight, stringSpacing } = SIZES[size];
    const numStrings = 6;
    const numFrets = 5;
    const startX = 30;
    const startY = 30;
    const nutHeight = 4;

    const stringNames = ['E', 'A', 'D', 'G', 'B', 'e'];

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="text-sm font-semibold">{chord}</div>
            <svg width={width} height={height} className="bg-background">
                {/* Fret number indicator */}
                {diagram.baseFret > 1 && (
                    <text
                        x={startX - 15}
                        y={startY + fretHeight / 2}
                        className="fill-foreground text-xs"
                        textAnchor="middle"
                    >
                        {diagram.baseFret}fr
                    </text>
                )}

                {/* Draw strings (vertical lines) */}
                {Array.from({ length: numStrings }).map((_, i) => {
                    const x = startX + i * stringSpacing;
                    return (
                        <line
                            key={`string-${i}`}
                            x1={x}
                            y1={startY}
                            x2={x}
                            y2={startY + numFrets * fretHeight}
                            stroke="currentColor"
                            strokeWidth={i === 0 || i === numStrings - 1 ? 2 : 1}
                            className="stroke-foreground/60"
                        />
                    );
                })}

                {/* Draw frets (horizontal lines) */}
                {Array.from({ length: numFrets + 1 }).map((_, i) => {
                    const y = startY + i * fretHeight;
                    const isNut = i === 0 && diagram.baseFret === 1;
                    return (
                        <line
                            key={`fret-${i}`}
                            x1={startX}
                            y1={y}
                            x2={startX + (numStrings - 1) * stringSpacing}
                            y2={y}
                            stroke="currentColor"
                            strokeWidth={isNut ? nutHeight : 2}
                            className="stroke-foreground/60"
                        />
                    );
                })}

                {/* Draw barre chords */}
                {diagram.barres?.map((barre, idx) => {
                    const [fret, startString, endString] = barre;
                    const y = startY + (fret - diagram.baseFret + 0.5) * fretHeight;
                    const x1 = startX + (startString - 1) * stringSpacing;
                    const x2 = startX + (endString - 1) * stringSpacing;
                    return (
                        <line
                            key={`barre-${idx}`}
                            x1={x1}
                            y1={y}
                            x2={x2}
                            y2={y}
                            stroke="currentColor"
                            strokeWidth={8}
                            strokeLinecap="round"
                            className="stroke-primary"
                            opacity={0.7}
                        />
                    );
                })}

                {/* Draw finger positions */}
                {diagram.frets.map((fret, stringIndex) => {
                    const x = startX + stringIndex * stringSpacing;

                    if (fret === -1) {
                        // X for muted string
                        return (
                            <g key={`finger-${stringIndex}`}>
                                <line
                                    x1={x - 4}
                                    y1={startY - 15}
                                    x2={x + 4}
                                    y2={startY - 7}
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    className="stroke-destructive"
                                />
                                <line
                                    x1={x + 4}
                                    y1={startY - 15}
                                    x2={x - 4}
                                    y2={startY - 7}
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    className="stroke-destructive"
                                />
                            </g>
                        );
                    } else if (fret === 0) {
                        // O for open string
                        return (
                            <circle
                                key={`finger-${stringIndex}`}
                                cx={x}
                                cy={startY - 11}
                                r={5}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                className="stroke-foreground"
                            />
                        );
                    } else {
                        // Finger position dot
                        const y = startY + (fret - diagram.baseFret + 0.5) * fretHeight;
                        const fingerNumber = diagram.fingers[stringIndex];
                        return (
                            <g key={`finger-${stringIndex}`}>
                                <circle
                                    cx={x}
                                    cy={y}
                                    r={8}
                                    fill="currentColor"
                                    className="fill-primary"
                                />
                                {fingerNumber > 0 && (
                                    <text
                                        x={x}
                                        y={y}
                                        className="fill-primary-foreground text-xs font-bold"
                                        textAnchor="middle"
                                        dominantBaseline="central"
                                    >
                                        {fingerNumber}
                                    </text>
                                )}
                            </g>
                        );
                    }
                })}

                {/* String names at bottom */}
                {stringNames.map((name, i) => {
                    const x = startX + i * stringSpacing;
                    return (
                        <text
                            key={`string-name-${i}`}
                            x={x}
                            y={startY + numFrets * fretHeight + 15}
                            className="fill-muted-foreground text-xs"
                            textAnchor="middle"
                        >
                            {name}
                        </text>
                    );
                })}
            </svg>

            {/* Finger legend */}
            <div className="text-xs text-muted-foreground">
                <div className="flex gap-2">
                    <span>1=Index</span>
                    <span>2=Middle</span>
                    <span>3=Ring</span>
                    <span>4=Pinky</span>
                </div>
            </div>
        </div>
    );
}

// Made with Bob
