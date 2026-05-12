/**
 * Pause Overlay Component
 * Menu displayed when game is paused
 */

import { LogOut, RotateCcw, Play, Settings } from 'lucide-react';

import type { GameState } from '@/types/musicGame';

import { SpeedControl } from './SpeedControl';
import { Switch } from '@/components/ui/switch';

interface PauseOverlayProps {
  gameState: GameState;
  onResume: () => void;
  onRestart: () => void;
  onExit: () => void;
  onUpdateSettings: (settings: Partial<GameState>) => void;
}

export function PauseOverlay({
  gameState,
  onResume,
  onRestart,
  onExit,
  onUpdateSettings,
}: PauseOverlayProps) {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md space-y-6 rounded-3xl bg-gradient-to-b from-blue-600 to-blue-700 p-8 shadow-2xl">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Paused</h2>
        </div>

        {/* Main Menu Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onExit}
            className="flex flex-col items-center gap-2 rounded-2xl bg-white/10 p-6 transition-all hover:bg-white/20 active:scale-95"
          >
            <LogOut className="h-8 w-8 text-white" />
            <span className="text-sm font-semibold text-white">Exit</span>
          </button>

          <button
            onClick={onRestart}
            className="flex flex-col items-center gap-2 rounded-2xl bg-white/10 p-6 transition-all hover:bg-white/20 active:scale-95"
          >
            <RotateCcw className="h-8 w-8 text-white" />
            <span className="text-sm font-semibold text-white">Restart</span>
          </button>

          <button
            onClick={onResume}
            className="flex flex-col items-center gap-2 rounded-2xl bg-lime-400 p-6 transition-all hover:bg-lime-300 active:scale-95"
          >
            <Play className="h-8 w-8 fill-gray-800 text-gray-800" />
            <span className="text-sm font-semibold text-gray-800">Perform</span>
          </button>

          <button
            className="flex flex-col items-center gap-2 rounded-2xl bg-white/10 p-6 transition-all hover:bg-white/20 active:scale-95"
          >
            <Settings className="h-8 w-8 text-white" />
            <span className="text-sm font-semibold text-white">Options</span>
          </button>
        </div>

        {/* Speed Control */}
        <div className="rounded-2xl bg-white/10 p-6">
          <SpeedControl
            speed={gameState.speed}
            onSpeedChange={(speed) => onUpdateSettings({ speed })}
            enabled={!gameState.autoSpeed}
            onEnabledChange={(enabled) => onUpdateSettings({ autoSpeed: !enabled })}
          />
        </div>

        {/* Settings Toggles */}
        <div className="space-y-3 rounded-2xl bg-white/10 p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white">Auto Speed</span>
            <Switch
              checked={gameState.autoSpeed}
              onCheckedChange={(checked) => onUpdateSettings({ autoSpeed: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white">Metronome</span>
            <Switch
              checked={gameState.metronome}
              onCheckedChange={(checked) => onUpdateSettings({ metronome: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white">Guitar Sound</span>
            <Switch
              checked={gameState.guitarSound}
              onCheckedChange={(checked) => onUpdateSettings({ guitarSound: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white">Left Handed Mode</span>
            <Switch
              checked={gameState.leftHanded}
              onCheckedChange={(checked) => onUpdateSettings({ leftHanded: checked })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Made with Bob
