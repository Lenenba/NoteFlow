/**
 * Instrument View Component
 * Unified container around FretboardView / KeyboardView / DrumKitView.
 * Provides a row of instrument tabs at the top.
 */

import { DrumKitView } from './DrumKitView';
import { FretboardView } from './FretboardView';
import { KeyboardView } from './KeyboardView';

export type InstrumentType = 'guitar' | 'electric' | 'bass' | 'piano' | 'drums';

interface InstrumentViewProps {
  instrument: InstrumentType;
  onInstrumentChange: (instrument: InstrumentType) => void;
  chord?: string;
  nextChord?: string;
  className?: string;
}

const TABS: { key: InstrumentType; label: string; accent: string }[] = [
  { key: 'guitar', label: 'Guitar', accent: '#FFB84D' },
  { key: 'electric', label: 'Electric', accent: '#00E5FF' },
  { key: 'bass', label: 'Bass', accent: '#B824F5' },
  { key: 'piano', label: 'Piano', accent: '#B8F34A' },
  { key: 'drums', label: 'Drums', accent: '#FF6464' },
];

export function InstrumentView({
  instrument,
  onInstrumentChange,
  chord,
  nextChord,
  className = '',
}: InstrumentViewProps) {
  return (
    <div className={`flex h-full flex-col gap-3 ${className}`}>
      {/* Instrument tabs */}
      <div className="flex flex-wrap gap-1.5 rounded-2xl bg-white/[0.04] p-1.5">
        {TABS.map((tab) => {
          const isActive = tab.key === instrument;

          return (
            <button
              key={tab.key}
              onClick={() => onInstrumentChange(tab.key)}
              className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition-all ${
                isActive
                  ? 'text-white shadow-lg'
                  : 'text-white/55 hover:bg-white/5 hover:text-white/85'
              }`}
              style={
                isActive
                  ? {
                      background: `linear-gradient(135deg, ${tab.accent}40, ${tab.accent}20)`,
                      boxShadow: `inset 0 0 0 1px ${tab.accent}55, 0 8px 24px -8px ${tab.accent}55`,
                    }
                  : undefined
              }
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Currently playing diagram */}
      <div className="flex-1">
        <CurrentDiagram instrument={instrument} chord={chord} />
      </div>

      {/* Up-next chord teaser */}
      {nextChord && (
        <div className="rounded-2xl bg-white/[0.03] p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/45">
              Up next
            </span>
            <span className="text-xl font-black text-white/95">{nextChord}</span>
          </div>
          <div className="opacity-80">
            <UpNextPreview instrument={instrument} chord={nextChord} />
          </div>
        </div>
      )}
    </div>
  );
}

function CurrentDiagram({
  instrument,
  chord,
}: {
  instrument: InstrumentType;
  chord?: string;
}) {
  if (instrument === 'piano') {
    return <KeyboardView chord={chord} />;
  }

  if (instrument === 'drums') {
    return <DrumKitView chord={chord} />;
  }

  // Map UI instrument → fretboard variant.
  const variant = instrument === 'electric' ? 'electric' : instrument === 'bass' ? 'bass' : 'acoustic';

  return <FretboardView chord={chord} variant={variant} />;
}

/**
 * Compact preview rendered for the upcoming chord. Reuses the same components
 * with smaller styling via opacity. Kept simple — full diagrams hidden,
 * just the chord name plus its instrument context.
 */
function UpNextPreview({
  instrument,
  chord,
}: {
  instrument: InstrumentType;
  chord: string;
}) {
  if (instrument === 'drums') {
    return <DrumKitView chord={chord} />;
  }

  if (instrument === 'piano') {
    return <KeyboardView chord={chord} />;
  }

  const variant = instrument === 'electric' ? 'electric' : instrument === 'bass' ? 'bass' : 'acoustic';

  return <FretboardView chord={chord} variant={variant} fretCount={5} />;
}
