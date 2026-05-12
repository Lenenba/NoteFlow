/**
 * Score Counter Component
 * Top-right display of the current score with optional secondary line.
 */

import { formatScore } from '@/services/music/gameTiming';

interface ScoreCounterProps {
  score: number;
  accuracy?: number;
}

export function ScoreCounter({ score, accuracy }: ScoreCounterProps) {
  return (
    <div className="pointer-events-none absolute right-6 top-6 z-10 text-right">
      <div className="text-[3rem] font-black leading-none tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
        {formatScore(score)}
      </div>
      <div className="mt-1 text-base font-semibold text-white/80 drop-shadow">
        {accuracy !== undefined ? `${accuracy.toFixed(1)}%` : '0'}
      </div>
    </div>
  );
}
