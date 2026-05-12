/**
 * Drum Pattern Diagram Component
 * Displays drum notation with kick, snare, hi-hat patterns
 */

import type { DrumPattern } from '@/data/chordDiagrams';

interface DrumDiagramProps {
    pattern: DrumPattern;
    size?: 'sm' | 'md' | 'lg';
}

const SIZES = {
    sm: { width: 200, height: 100, beatWidth: 40 },
    md: { width: 300, height: 150, beatWidth: 60 },
    lg: { width: 400, height: 200, beatWidth: 80 },
};

const DRUM_COLORS = {
    Kick: '#ef4444', // red
    Snare: '#3b82f6', // blue
    'Hi-hat': '#eab308', // yellow
    Tom: '#8b5cf6', // purple
    Crash: '#ec4899', // pink
};

export default function DrumDiagram({ pattern, size = 'md' }: DrumDiagramProps) {
    const { width, height, beatWidth } = SIZES[size];
    const numBeats = 4; // 4/4 time
    const instrumentHeight = height / (pattern.instruments.length + 1);
    const startX = 40;
    const startY = 30;

    // Group hits by beat
    const beatHits: Map<number, Array<{ instrument: number; velocity: number }>> = new Map();

    pattern.pattern.forEach(([time, instrument, velocity]) => {
        const beat = Math.floor(time);

        if (!beatHits.has(beat)) {
            beatHits.set(beat, []);
        }
        beatHits.get(beat)!.push({ instrument, velocity });
    });

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="text-sm font-semibold">{pattern.name}</div>
            <div className="text-xs text-muted-foreground">{pattern.tempo} BPM</div>

            <svg width={width} height={height} className="bg-background">
                {/* Draw beat lines */}
                {Array.from({ length: numBeats + 1 }).map((_, i) => {
                    const x = startX + i * beatWidth;

                    return (
                        <line
                            key={`beat-line-${i}`}
                            x1={x}
                            y1={startY}
                            x2={x}
                            y2={startY + pattern.instruments.length * instrumentHeight}
                            stroke="currentColor"
                            strokeWidth={i === 0 || i === numBeats ? 2 : 1}
                            className="stroke-foreground/20"
                            strokeDasharray={i === 0 || i === numBeats ? '0' : '2,2'}
                        />
                    );
                })}

                {/* Draw instrument lines */}
                {pattern.instruments.map((instrument, idx) => {
                    const y = startY + idx * instrumentHeight;
                    const color = DRUM_COLORS[instrument as keyof typeof DRUM_COLORS] || '#666';

                    return (
                        <g key={`instrument-${idx}`}>
                            {/* Instrument line */}
                            <line
                                x1={startX}
                                y1={y}
                                x2={startX + numBeats * beatWidth}
                                y2={y}
                                stroke="currentColor"
                                strokeWidth={1}
                                className="stroke-foreground/30"
                            />
                            {/* Instrument label */}
                            <text
                                x={startX - 10}
                                y={y}
                                className="text-xs"
                                textAnchor="end"
                                dominantBaseline="middle"
                                fill={color}
                            >
                                {instrument}
                            </text>
                        </g>
                    );
                })}

                {/* Draw hits */}
                {pattern.pattern.map(([time, instrumentIdx, velocity], hitIdx) => {
                    const x = startX + time * beatWidth;
                    const y = startY + instrumentIdx * instrumentHeight;
                    const instrument = pattern.instruments[instrumentIdx];
                    const color = DRUM_COLORS[instrument as keyof typeof DRUM_COLORS] || '#666';
                    const radius = 4 + (velocity / 100) * 4; // Size based on velocity

                    return (
                        <g key={`hit-${hitIdx}`}>
                            <circle cx={x} cy={y} r={radius} fill={color} opacity={0.8} />
                            {velocity > 80 && (
                                <circle cx={x} cy={y} r={radius + 3} fill="none" stroke={color} strokeWidth={1} />
                            )}
                        </g>
                    );
                })}

                {/* Beat numbers */}
                {Array.from({ length: numBeats }).map((_, i) => {
                    const x = startX + i * beatWidth + beatWidth / 2;
                    const y = startY + pattern.instruments.length * instrumentHeight + 20;

                    return (
                        <text
                            key={`beat-num-${i}`}
                            x={x}
                            y={y}
                            className="fill-muted-foreground text-xs"
                            textAnchor="middle"
                        >
                            {i + 1}
                        </text>
                    );
                })}
            </svg>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 text-xs">
                {pattern.instruments.map((instrument) => {
                    const color = DRUM_COLORS[instrument as keyof typeof DRUM_COLORS] || '#666';

                    return (
                        <div key={instrument} className="flex items-center gap-1">
                            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
                            <span className="text-muted-foreground">{instrument}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// Made with Bob
