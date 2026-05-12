/**
 * Game HUD Component
 * Top heads-up display combining combo badge, score counter and the
 * faded section label that floats above the music highway.
 */

import type { SectionEvent } from '@/types/musicGame';
import { ComboBadge } from './ComboBadge';
import { ScoreCounter } from './ScoreCounter';

interface GameHudProps {
  score: number;
  combo: number;
  multiplier: number;
  currentSection?: SectionEvent;
}

export function GameHud({ score, combo, multiplier, currentSection }: GameHudProps) {
  return (
    <>
      <ComboBadge combo={combo} multiplier={multiplier} />
      <ScoreCounter score={score} />

      {currentSection && (
        <div className="pointer-events-none absolute left-1/2 top-[26%] z-[5] -translate-x-1/2 -translate-y-1/2">
          <span
            key={currentSection.id}
            className="animate-in fade-in zoom-in-95 duration-500 text-2xl font-bold tracking-wide text-white/40 drop-shadow-sm"
          >
            {currentSection.label}
          </span>
        </div>
      )}
    </>
  );
}
