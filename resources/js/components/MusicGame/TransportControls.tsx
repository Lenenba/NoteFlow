/**
 * Transport Controls Component
 * Round play/pause button anchored to the bottom-left of the screen.
 */

import { Pause, Play } from 'lucide-react';

interface TransportControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export function TransportControls({ isPlaying, onTogglePlay }: TransportControlsProps) {
  return (
    <div className="absolute bottom-6 left-6 z-10">
      <button
        onClick={onTogglePlay}
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-black/55 text-white shadow-[0_4px_24px_rgba(0,0,0,0.25)] backdrop-blur-md transition-all hover:scale-110 hover:bg-black/70 active:scale-95"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <Pause className="h-6 w-6 fill-white" strokeWidth={0} />
        ) : (
          <Play className="h-6 w-6 fill-white translate-x-[2px]" strokeWidth={0} />
        )}
      </button>
    </div>
  );
}
