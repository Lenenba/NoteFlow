/**
 * Speed Control Component
 * Controls playback speed with slider and buttons
 */

import { Minus, Plus } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface SpeedControlProps {
  speed: number;
  onSpeedChange: (speed: number) => void;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
}

export function SpeedControl({
  speed,
  onSpeedChange,
  enabled,
  onEnabledChange,
}: SpeedControlProps) {
  const handleDecrease = () => {
    const newSpeed = Math.max(0.5, speed - 0.1);
    onSpeedChange(Math.round(newSpeed * 10) / 10);
  };

  const handleIncrease = () => {
    const newSpeed = Math.min(2.0, speed + 0.1);
    onSpeedChange(Math.round(newSpeed * 10) / 10);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSpeed = parseFloat(e.target.value);
    onSpeedChange(newSpeed);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-white">Speed Control</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/70">
            {enabled ? 'ON' : 'OFF'}
          </span>
          <Switch checked={enabled} onCheckedChange={onEnabledChange} />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleDecrease}
          disabled={!enabled || speed <= 0.5}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 disabled:opacity-30"
        >
          <Minus className="h-4 w-4 text-white" />
        </button>

        <div className="flex-1">
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={speed}
            onChange={handleSliderChange}
            disabled={!enabled}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/20 disabled:opacity-30"
            style={{
              background: enabled
                ? `linear-gradient(to right, #B8F34A 0%, #B8F34A ${((speed - 0.5) / 1.5) * 100}%, rgba(255,255,255,0.2) ${((speed - 0.5) / 1.5) * 100}%, rgba(255,255,255,0.2) 100%)`
                : undefined,
            }}
          />
        </div>

        <button
          onClick={handleIncrease}
          disabled={!enabled || speed >= 2.0}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 disabled:opacity-30"
        >
          <Plus className="h-4 w-4 text-white" />
        </button>
      </div>

      <div className="text-center">
        <span className="text-2xl font-bold text-white">
          {Math.round(speed * 100)}%
        </span>
        <span className="ml-2 text-sm text-white/70">Speed</span>
      </div>
    </div>
  );
}

// Made with Bob
