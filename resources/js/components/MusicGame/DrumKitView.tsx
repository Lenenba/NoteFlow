/**
 * Drum Kit View Component
 * Visual drum kit with pads that highlight when the current chord/section uses them.
 * Shows kick / snare / hi-hat / toms / crash arranged like a real kit, plus a
 * 16-step pattern grid below.
 */

import { DRUM_PATTERNS } from '@/data/chordDiagrams';

interface DrumKitViewProps {
  chord?: string;
}

interface Pad {
  key: 'Kick' | 'Snare' | 'Hi-hat' | 'Tom' | 'Crash';
  label: string;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  color: string;
}

const PADS: Pad[] = [
  { key: 'Crash', label: 'Crash', cx: 80, cy: 60, rx: 38, ry: 14, color: '#FFCE4A' },
  { key: 'Hi-hat', label: 'Hi-hat', cx: 240, cy: 60, rx: 30, ry: 12, color: '#79C928' },
  { key: 'Tom', label: 'Tom', cx: 160, cy: 105, rx: 30, ry: 16, color: '#B824F5' },
  { key: 'Snare', label: 'Snare', cx: 95, cy: 145, rx: 36, ry: 18, color: '#009FE3' },
  { key: 'Kick', label: 'Kick', cx: 200, cy: 175, rx: 56, ry: 30, color: '#FF6464' },
];

export function DrumKitView({ chord }: DrumKitViewProps) {
  const pattern = chord ? DRUM_PATTERNS[chord] : DRUM_PATTERNS['Basic Rock'];

  // Determine which pads are active in this pattern.
  const activeIndices = new Set<number>(
    pattern ? pattern.pattern.map(([, instrument]) => instrument) : [],
  );

  const activeKeys = new Set<Pad['key']>();
  if (pattern) {
    pattern.instruments.forEach((inst, idx) => {
      if (activeIndices.has(idx)) {
        activeKeys.add(inst as Pad['key']);
      }
    });
  }

  const stepCount = 16;

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-white/[0.04] p-4">
      <div className="mb-3 flex items-baseline gap-2">
        <span className="text-xs font-medium uppercase tracking-wider text-rose-300/80">
          Drums
        </span>
        <span className="text-3xl font-black tracking-tight text-white">
          {pattern?.name ?? 'Drum Pattern'}
        </span>
        {pattern && (
          <span className="ml-auto rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
            {pattern.tempo} BPM
          </span>
        )}
      </div>

      {/* Drum kit illustration */}
      <div className="flex w-full justify-center">
        <svg viewBox="0 0 320 220" width="100%" height="100%" className="max-w-[420px]">
          <defs>
            <radialGradient id="drumGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
              <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Stage floor highlight */}
          <ellipse cx="160" cy="200" rx="140" ry="14" fill="rgba(255,255,255,0.05)" />

          {PADS.map((pad) => {
            const active = activeKeys.has(pad.key);

            return (
              <g key={pad.key}>
                {active && (
                  <ellipse
                    cx={pad.cx}
                    cy={pad.cy}
                    rx={pad.rx + 6}
                    ry={pad.ry + 6}
                    fill={pad.color}
                    opacity={0.25}
                  />
                )}
                {/* Pad shadow */}
                <ellipse
                  cx={pad.cx}
                  cy={pad.cy + 3}
                  rx={pad.rx}
                  ry={pad.ry}
                  fill="rgba(0,0,0,0.4)"
                />
                {/* Pad surface */}
                <ellipse
                  cx={pad.cx}
                  cy={pad.cy}
                  rx={pad.rx}
                  ry={pad.ry}
                  fill={active ? pad.color : '#2A2D32'}
                  stroke={active ? '#FFFFFF' : 'rgba(255,255,255,0.2)'}
                  strokeWidth={active ? 2 : 1}
                />
                {/* Pad highlight */}
                <ellipse cx={pad.cx} cy={pad.cy - 4} rx={pad.rx * 0.7} ry={pad.ry * 0.3} fill="url(#drumGlow)" />
                {/* Pad label */}
                <text
                  x={pad.cx}
                  y={pad.cy + 4}
                  fill={active ? '#0F0F0F' : 'rgba(255,255,255,0.55)'}
                  fontSize={11}
                  fontWeight={800}
                  textAnchor="middle"
                  fontFamily="system-ui, sans-serif"
                >
                  {pad.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* 16-step pattern grid */}
      {pattern && (
        <div className="mt-2 space-y-1.5">
          {pattern.instruments.map((inst, instIdx) => {
            const hitsAtStep = (step: number) =>
              pattern.pattern.some(
                ([t, i]) => i === instIdx && Math.floor(t * 4) === step,
              );

            const pad = PADS.find((p) => p.key === inst);
            const color = pad?.color ?? '#FFFFFF';

            return (
              <div key={inst} className="flex items-center gap-2">
                <span className="w-14 shrink-0 text-[10px] font-semibold uppercase tracking-wider text-white/55">
                  {inst}
                </span>
                <div
                  className="grid flex-1 gap-[3px]"
                  style={{ gridTemplateColumns: `repeat(${stepCount}, minmax(0, 1fr))` }}
                >
                  {Array.from({ length: stepCount }).map((_, step) => {
                    const active = hitsAtStep(step);
                    const isDownbeat = step % 4 === 0;

                    return (
                      <div
                        key={step}
                        className={`h-3 rounded-[2px] transition-colors ${
                          active ? '' : isDownbeat ? 'bg-white/15' : 'bg-white/[0.06]'
                        }`}
                        style={active ? { backgroundColor: color, boxShadow: `0 0 6px ${color}AA` } : undefined}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
