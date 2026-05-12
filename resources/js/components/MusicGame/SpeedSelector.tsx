/**
 * Speed Selector Component
 * Yousician-style speed selector with animal icons (snail / turtle / rabbit / cheetah).
 * Each animal represents a discrete playback speed.
 */

import { Rabbit, Snail, Turtle, Zap } from 'lucide-react';

interface SpeedSelectorProps {
  speed: number;
  onSpeedChange: (speed: number) => void;
  className?: string;
}

const SPEEDS: { value: number; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 0.5, label: 'Snail', icon: Snail },
  { value: 0.75, label: 'Turtle', icon: Turtle },
  { value: 1.0, label: 'Rabbit', icon: Rabbit },
  { value: 1.25, label: 'Cheetah', icon: Zap },
];

export function SpeedSelector({ speed, onSpeedChange, className = '' }: SpeedSelectorProps) {
  // Find the closest defined speed for visual highlight.
  const activeIndex = SPEEDS.reduce((closest, item, idx) => {
    return Math.abs(item.value - speed) < Math.abs(SPEEDS[closest].value - speed) ? idx : closest;
  }, 0);

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/55 p-1 backdrop-blur-md shadow-lg ${className}`}
    >
      {SPEEDS.map((sp, idx) => {
        const Icon = sp.icon;
        const isActive = idx === activeIndex;

        return (
          <button
            key={sp.value}
            onClick={() => onSpeedChange(sp.value)}
            className={`group relative flex h-9 w-9 items-center justify-center rounded-full transition-all ${
              isActive
                ? 'bg-white text-zinc-900 shadow-[0_4px_12px_-2px_rgba(255,255,255,0.5)]'
                : 'text-white/55 hover:text-white/90'
            }`}
            aria-label={sp.label}
            title={`${sp.label} (${Math.round(sp.value * 100)}%)`}
          >
            <Icon className="h-4 w-4" />
          </button>
        );
      })}
    </div>
  );
}
