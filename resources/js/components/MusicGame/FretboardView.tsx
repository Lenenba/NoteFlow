/**
 * Fretboard View Component
 * Beautiful horizontal fretboard rendering for guitar, bass and electric guitar.
 * Strings run horizontally; fret bars are vertical metallic lines.
 * Finger positions for the current chord are drawn as glowing dots.
 */

import { useMemo } from 'react';

import type { GuitarChordDiagram } from '@/data/chordDiagrams';
import { GUITAR_CHORDS } from '@/data/chordDiagrams';

export type FretboardVariant = 'acoustic' | 'electric' | 'bass';

interface FretboardViewProps {
  chord?: string;
  variant?: FretboardVariant;
  /** Number of frets to display. Default 5 for chord shapes. */
  fretCount?: number;
}

interface ThemeColors {
  woodTop: string;
  woodBottom: string;
  fretMetal: string;
  fretShadow: string;
  stringColor: string;
  accentColor: string;
  accentGlow: string;
  inlayColor: string;
  edgeColor: string;
  background: string;
}

const VARIANTS: Record<FretboardVariant, ThemeColors> = {
  acoustic: {
    woodTop: '#6B4226',
    woodBottom: '#3A2515',
    fretMetal: '#D8D8D8',
    fretShadow: '#777777',
    stringColor: '#F2EAD3',
    accentColor: '#FFB84D',
    accentGlow: 'rgba(255,184,77,0.55)',
    inlayColor: '#F5E6D3',
    edgeColor: '#28160B',
    background: 'rgba(255,255,255,0.04)',
  },
  electric: {
    woodTop: '#1A1A24',
    woodBottom: '#0B0B12',
    fretMetal: '#E8F4FF',
    fretShadow: '#445566',
    stringColor: '#E0F2FF',
    accentColor: '#00E5FF',
    accentGlow: 'rgba(0,229,255,0.7)',
    inlayColor: '#7AE0FF',
    edgeColor: '#000814',
    background: 'rgba(0,229,255,0.06)',
  },
  bass: {
    woodTop: '#3D2A1A',
    woodBottom: '#1F140B',
    fretMetal: '#D0D0D0',
    fretShadow: '#666666',
    stringColor: '#F5E8C8',
    accentColor: '#B824F5',
    accentGlow: 'rgba(184,36,245,0.6)',
    inlayColor: '#E8DBC0',
    edgeColor: '#170A02',
    background: 'rgba(184,36,245,0.05)',
  },
};

const STRING_NAMES_GUITAR = ['E', 'A', 'D', 'G', 'B', 'e'];
const STRING_NAMES_BASS = ['E', 'A', 'D', 'G'];

const FINGER_COLORS = ['', '#FF7A7A', '#FFB54A', '#79C928', '#B824F5'];

export function FretboardView({
  chord,
  variant = 'acoustic',
  fretCount = 5,
}: FretboardViewProps) {
  const theme = VARIANTS[variant];
  const stringCount = variant === 'bass' ? 4 : 6;
  const stringNames = variant === 'bass' ? STRING_NAMES_BASS : STRING_NAMES_GUITAR;

  // SVG layout constants.
  const padLeft = 56;
  const padRight = 24;
  const padTop = 26;
  const padBottom = 32;

  const fretWidth = 78;
  const stringSpacing = variant === 'bass' ? 28 : 22;

  const width = padLeft + padRight + fretCount * fretWidth;
  const height = padTop + padBottom + (stringCount - 1) * stringSpacing;

  // Resolve the chord diagram. Guitar diagrams are used for guitar and electric;
  // bass uses the same shape but truncated to 4 strings.
  const diagram = useMemo<GuitarChordDiagram | null>(() => {
    if (!chord) {
      return null;
    }

    const full = GUITAR_CHORDS[chord];

    if (!full) {
      return null;
    }

    if (variant !== 'bass') {
      return full;
    }

    // Bass: only keep the 4 lowest strings (E, A, D, G).
    return {
      ...full,
      frets: full.frets.slice(0, 4),
      fingers: full.fingers.slice(0, 4),
    };
  }, [chord, variant]);

  const baseFret = diagram?.baseFret ?? 1;
  const fretboardTop = padTop;
  const fretboardBottom = padTop + (stringCount - 1) * stringSpacing;
  const fretboardLeft = padLeft;
  const fretboardRight = padLeft + fretCount * fretWidth;

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl p-4"
      style={{ background: theme.background }}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span
            className="text-xs font-medium uppercase tracking-wider opacity-60"
            style={{ color: theme.accentColor }}
          >
            {variant === 'bass' ? 'Bass' : variant === 'electric' ? 'Electric Guitar' : 'Acoustic Guitar'}
          </span>
          {chord && (
            <span className="text-3xl font-black tracking-tight text-white">
              {chord}
            </span>
          )}
        </div>
        {chord && !diagram && (
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
            Chord diagram unavailable
          </span>
        )}
      </div>

      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width="100%"
          height="100%"
          className="block"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Wood / body gradient */}
          <defs>
            <linearGradient id={`wood-${variant}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={theme.woodTop} />
              <stop offset="100%" stopColor={theme.woodBottom} />
            </linearGradient>
            <linearGradient id={`metal-${variant}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="50%" stopColor={theme.fretMetal} />
              <stop offset="100%" stopColor={theme.fretShadow} />
            </linearGradient>
            <radialGradient id={`fingerDot-${variant}`} cx="35%" cy="30%" r="80%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="40%" stopColor={theme.accentColor} />
              <stop offset="100%" stopColor={theme.accentColor} stopOpacity="0.6" />
            </radialGradient>
          </defs>

          {/* Wooden fretboard */}
          <rect
            x={fretboardLeft}
            y={fretboardTop - 12}
            width={fretboardRight - fretboardLeft}
            height={fretboardBottom - fretboardTop + 24}
            rx={4}
            fill={`url(#wood-${variant})`}
            stroke={theme.edgeColor}
            strokeWidth={2}
          />

          {/* Subtle wood grain stripes */}
          {Array.from({ length: stringCount + 2 }).map((_, i) => {
            const y = fretboardTop - 12 + i * (fretboardBottom - fretboardTop + 24) / (stringCount + 1);

            return (
              <line
                key={`grain-${i}`}
                x1={fretboardLeft + 2}
                y1={y}
                x2={fretboardRight - 2}
                y2={y + 1}
                stroke="rgba(255,255,255,0.04)"
                strokeWidth={1}
              />
            );
          })}

          {/* Nut: thick white bar on the left when at base fret 1 */}
          {baseFret === 1 && (
            <rect
              x={fretboardLeft - 4}
              y={fretboardTop - 14}
              width={6}
              height={fretboardBottom - fretboardTop + 28}
              rx={1.5}
              fill="#F5F5F5"
              stroke="#999"
              strokeWidth={0.5}
            />
          )}

          {/* Fret bars (vertical metallic lines) */}
          {Array.from({ length: fretCount + 1 }).map((_, i) => {
            const x = fretboardLeft + i * fretWidth;

            return (
              <rect
                key={`fret-${i}`}
                x={x - 1.4}
                y={fretboardTop - 12}
                width={2.8}
                height={fretboardBottom - fretboardTop + 24}
                fill={`url(#metal-${variant})`}
                opacity={i === 0 && baseFret === 1 ? 0 : 1}
              />
            );
          })}

          {/* Inlay dots at frets 3, 5, 7, 9 (and 12 with double dot) */}
          {[3, 5, 7, 9].map((globalFret) => {
            const localFret = globalFret - baseFret + 1;

            if (localFret < 1 || localFret > fretCount) {
              return null;
            }

            const cx = fretboardLeft + (localFret - 0.5) * fretWidth;
            const cy = (fretboardTop + fretboardBottom) / 2;

            return (
              <circle
                key={`inlay-${globalFret}`}
                cx={cx}
                cy={cy}
                r={4.5}
                fill={theme.inlayColor}
                opacity={0.65}
              />
            );
          })}

          {/* Strings (horizontal lines) */}
          {Array.from({ length: stringCount }).map((_, i) => {
            const y = fretboardTop + i * stringSpacing;
            // Strings are thicker at the top (lower bass strings).
            const thickness =
              variant === 'bass'
                ? 2.2 + (stringCount - 1 - i) * 0.4
                : 1.1 + (stringCount - 1 - i) * 0.25;

            return (
              <g key={`string-${i}`}>
                {/* Subtle shadow under each string */}
                <line
                  x1={fretboardLeft}
                  y1={y + 1}
                  x2={fretboardRight}
                  y2={y + 1}
                  stroke="rgba(0,0,0,0.4)"
                  strokeWidth={thickness}
                />
                <line
                  x1={fretboardLeft}
                  y1={y}
                  x2={fretboardRight}
                  y2={y}
                  stroke={theme.stringColor}
                  strokeWidth={thickness}
                />
              </g>
            );
          })}

          {/* String labels (E A D G B e) */}
          {stringNames.map((name, i) => {
            const y = fretboardTop + i * stringSpacing;

            return (
              <text
                key={`label-${i}`}
                x={fretboardLeft - 14}
                y={y + 4}
                fill={theme.stringColor}
                opacity={0.7}
                fontSize={12}
                fontWeight={600}
                textAnchor="middle"
                fontFamily="system-ui, sans-serif"
              >
                {name}
              </text>
            );
          })}

          {/* Fret number labels under each fret */}
          {Array.from({ length: fretCount }).map((_, i) => {
            const globalFret = baseFret + i;
            const x = fretboardLeft + (i + 0.5) * fretWidth;

            return (
              <text
                key={`fretnum-${i}`}
                x={x}
                y={fretboardBottom + 22}
                fill="rgba(255,255,255,0.45)"
                fontSize={11}
                fontWeight={500}
                textAnchor="middle"
                fontFamily="system-ui, sans-serif"
              >
                {globalFret}
              </text>
            );
          })}

          {/* Barre */}
          {diagram?.barres?.map((barre, idx) => {
            const [fret, startString, endString] = barre;
            const localFret = fret - baseFret + 1;

            if (localFret < 1 || localFret > fretCount) {
              return null;
            }

            const startStringIdx = Math.min(startString, stringCount) - 1;
            const endStringIdx = Math.min(endString, stringCount) - 1;
            const x = fretboardLeft + (localFret - 0.5) * fretWidth;
            const y1 = fretboardTop + (stringCount - 1 - endStringIdx) * stringSpacing;
            const y2 = fretboardTop + (stringCount - 1 - startStringIdx) * stringSpacing;

            return (
              <rect
                key={`barre-${idx}`}
                x={x - 11}
                y={Math.min(y1, y2) - 6}
                width={22}
                height={Math.abs(y2 - y1) + 12}
                rx={11}
                fill={theme.accentColor}
                opacity={0.85}
              />
            );
          })}

          {/* Finger positions */}
          {diagram?.frets.map((fret, idx) => {
            // diagram.frets is indexed from low E (string 6 = idx 0) to high e (string 1 = idx 5).
            const stringIdxFromBottom = stringCount - 1 - idx;
            const y = fretboardTop + stringIdxFromBottom * stringSpacing;
            const x0 = fretboardLeft + (stringCount === 4 && idx === 0 ? -8 : -22);

            if (fret === -1) {
              // X marker for muted string
              const size = 6;

              return (
                <g key={`mute-${idx}`}>
                  <line
                    x1={x0 - size}
                    y1={y - size}
                    x2={x0 + size}
                    y2={y + size}
                    stroke="#FF6464"
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                  <line
                    x1={x0 + size}
                    y1={y - size}
                    x2={x0 - size}
                    y2={y + size}
                    stroke="#FF6464"
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                </g>
              );
            }

            if (fret === 0) {
              // Open string circle
              return (
                <circle
                  key={`open-${idx}`}
                  cx={x0}
                  cy={y}
                  r={6}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth={2}
                  opacity={0.85}
                />
              );
            }

            const localFret = fret - baseFret + 1;

            if (localFret < 1 || localFret > fretCount) {
              return null;
            }

            const cx = fretboardLeft + (localFret - 0.5) * fretWidth;
            const fingerNum = diagram.fingers[idx] ?? 0;
            const fingerColor = FINGER_COLORS[fingerNum] || theme.accentColor;

            return (
              <g key={`finger-${idx}`}>
                {/* Glow halo */}
                <circle
                  cx={cx}
                  cy={y}
                  r={18}
                  fill={fingerColor}
                  opacity={0.18}
                />
                <circle
                  cx={cx}
                  cy={y}
                  r={13}
                  fill={fingerColor}
                  opacity={0.35}
                />
                {/* Main dot */}
                <circle
                  cx={cx}
                  cy={y}
                  r={11}
                  fill={fingerColor}
                  stroke="#FFFFFF"
                  strokeWidth={1.5}
                />
                {fingerNum > 0 && (
                  <text
                    x={cx}
                    y={y + 4}
                    fill="#FFFFFF"
                    fontSize={13}
                    fontWeight={800}
                    textAnchor="middle"
                    fontFamily="system-ui, sans-serif"
                  >
                    {fingerNum}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Finger legend */}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-xs text-white/60">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="flex items-center gap-1.5">
            <span
              className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white"
              style={{ backgroundColor: FINGER_COLORS[n] }}
            >
              {n}
            </span>
            <span>
              {n === 1 ? 'Index' : n === 2 ? 'Middle' : n === 3 ? 'Ring' : 'Pinky'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
