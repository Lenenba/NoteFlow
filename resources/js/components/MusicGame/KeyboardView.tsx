/**
 * Keyboard View Component
 * Polished horizontal piano keyboard with highlighted notes and finger numbers.
 */

import { PIANO_CHORDS } from '@/data/chordDiagrams';

interface KeyboardViewProps {
  chord?: string;
}

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FINGER_COLORS = ['', '#FF7A7A', '#FFB54A', '#F6E94A', '#79C928', '#009FE3'];

function isBlackKey(midiNote: number): boolean {
  return [1, 3, 6, 8, 10].includes(midiNote % 12);
}

function noteName(midiNote: number): string {
  const octave = Math.floor(midiNote / 12) - 1;
  const name = NOTE_NAMES[midiNote % 12];
  return `${name}${octave}`;
}

export function KeyboardView({ chord }: KeyboardViewProps) {
  const diagram = chord ? PIANO_CHORDS[chord] : undefined;

  // Visible range: 2 octaves around the chord, or C3..C5 default.
  const baseNote = diagram ? Math.min(...diagram.notes) - 5 : 48;
  const topNote = diagram ? Math.max(...diagram.notes) + 7 : 72;

  const allNotes = Array.from({ length: topNote - baseNote + 1 }, (_, i) => baseNote + i);
  const whiteNotes = allNotes.filter((n) => !isBlackKey(n));
  const blackNotes = allNotes.filter((n) => isBlackKey(n));

  const whiteWidth = 30;
  const whiteHeight = 130;
  const blackWidth = 18;
  const blackHeight = 82;

  const totalWidth = whiteNotes.length * whiteWidth;
  const padTop = 32;
  const padBottom = 8;
  const padX = 6;
  const height = padTop + whiteHeight + padBottom;
  const width = totalWidth + padX * 2;

  const getXForNote = (note: number): number => {
    if (!isBlackKey(note)) {
      const wIdx = whiteNotes.indexOf(note);
      return padX + wIdx * whiteWidth;
    }
    const whitesBefore = whiteNotes.filter((n) => n < note).length;
    return padX + whitesBefore * whiteWidth - blackWidth / 2;
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-white/[0.04] p-4">
      <div className="mb-3 flex items-baseline gap-2">
        <span className="text-xs font-medium uppercase tracking-wider text-cyan-300/80">
          Piano
        </span>
        {chord && (
          <span className="text-3xl font-black tracking-tight text-white">{chord}</span>
        )}
        {chord && !diagram && (
          <span className="ml-auto rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
            No diagram
          </span>
        )}
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
          className="block"
        >
          <defs>
            <linearGradient id="whiteKey" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#E6E6E6" />
            </linearGradient>
            <linearGradient id="whiteKeyHi" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#E8FFC9" />
              <stop offset="100%" stopColor="#B8F34A" />
            </linearGradient>
            <linearGradient id="blackKey" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#2B2B33" />
              <stop offset="100%" stopColor="#0E0E13" />
            </linearGradient>
            <linearGradient id="blackKeyHi" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#79C928" />
              <stop offset="100%" stopColor="#3F8C00" />
            </linearGradient>
          </defs>

          {/* White keys */}
          {whiteNotes.map((note, i) => {
            const highlighted = diagram?.notes.includes(note);
            const x = padX + i * whiteWidth;
            const isC = note % 12 === 0;

            return (
              <g key={`w-${note}`}>
                <rect
                  x={x}
                  y={padTop}
                  width={whiteWidth - 1}
                  height={whiteHeight}
                  rx={3}
                  fill={highlighted ? 'url(#whiteKeyHi)' : 'url(#whiteKey)'}
                  stroke="#444"
                  strokeWidth={0.5}
                />
                {/* C label */}
                {isC && (
                  <text
                    x={x + whiteWidth / 2}
                    y={padTop + whiteHeight - 8}
                    fill="rgba(0,0,0,0.55)"
                    fontSize={10}
                    fontWeight={700}
                    textAnchor="middle"
                  >
                    {noteName(note)}
                  </text>
                )}
                {/* Highlighted note name */}
                {highlighted && !isC && (
                  <text
                    x={x + whiteWidth / 2}
                    y={padTop + whiteHeight - 8}
                    fill="rgba(0,0,0,0.7)"
                    fontSize={10}
                    fontWeight={700}
                    textAnchor="middle"
                  >
                    {NOTE_NAMES[note % 12]}
                  </text>
                )}
              </g>
            );
          })}

          {/* Black keys (drawn on top) */}
          {blackNotes.map((note) => {
            const highlighted = diagram?.notes.includes(note);
            const x = getXForNote(note);

            return (
              <g key={`b-${note}`}>
                <rect
                  x={x}
                  y={padTop}
                  width={blackWidth}
                  height={blackHeight}
                  rx={2}
                  fill={highlighted ? 'url(#blackKeyHi)' : 'url(#blackKey)'}
                  stroke="#000"
                  strokeWidth={0.5}
                />
              </g>
            );
          })}

          {/* Finger dots above the highlighted notes */}
          {diagram?.notes.map((note, idx) => {
            const x = getXForNote(note);
            const w = isBlackKey(note) ? blackWidth : whiteWidth - 1;
            const cx = x + w / 2;
            const cy = padTop - 14;
            const finger = diagram.fingers[idx];
            const color = FINGER_COLORS[finger] || '#B8F34A';

            return (
              <g key={`f-${note}`}>
                <circle cx={cx} cy={cy} r={11} fill={color} stroke="#FFFFFF" strokeWidth={1.5} />
                <text
                  x={cx}
                  y={cy + 4}
                  fill="#FFFFFF"
                  fontSize={12}
                  fontWeight={800}
                  textAnchor="middle"
                >
                  {finger}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Finger legend */}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-xs text-white/60">
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} className="flex items-center gap-1.5">
            <span
              className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white"
              style={{ backgroundColor: FINGER_COLORS[n] }}
            >
              {n}
            </span>
            <span>
              {n === 1 ? 'Thumb' : n === 2 ? 'Index' : n === 3 ? 'Middle' : n === 4 ? 'Ring' : 'Pinky'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
