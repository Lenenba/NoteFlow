/**
 * Music Practice Demo Page
 * Lightweight showcase of the music game running on the built-in demo song.
 * Real songs are played from pages/Practice/Show.tsx via /songs/{id}/practice.
 */

import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Pause, Play, RotateCcw } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import AppLogoIcon from '@/components/app-logo-icon';
import { MusicPracticeGame } from '@/components/MusicGame/MusicPracticeGame';
import type {
  GameSnapshot,
  MusicPracticeGameApi,
} from '@/components/MusicGame/MusicPracticeGame';
import { SpeedSelector } from '@/components/MusicGame/SpeedSelector';
import { dashboard } from '@/routes';
import { formatScore } from '@/services/music/gameTiming';

const INITIAL: GameSnapshot = {
  currentTime: 0,
  score: 0,
  combo: 0,
  multiplier: 1,
  isPlaying: false,
  speed: 1,
};

export default function Show() {
  const [isLandscape, setIsLandscape] = useState(true);
  const [snapshot, setSnapshot] = useState<GameSnapshot>(INITIAL);
  const gameRef = useRef<MusicPracticeGameApi>(null);

  useEffect(() => {
    const check = () => {
      setIsLandscape(
        window.innerWidth > window.innerHeight ||
          window.matchMedia('(orientation: landscape)').matches,
      );
    };

    check();
    window.addEventListener('resize', check);
    window.addEventListener('orientationchange', check);
    return () => {
      window.removeEventListener('resize', check);
      window.removeEventListener('orientationchange', check);
    };
  }, []);

  const handlePlayPause = useCallback(() => {
    if (!gameRef.current) {
      return;
    }
    if (snapshot.isPlaying) {
      gameRef.current.pause();
    } else {
      gameRef.current.play();
    }
  }, [snapshot.isPlaying]);

  const handleRestart = useCallback(() => {
    gameRef.current?.reset();
  }, []);

  const handleSpeedChange = useCallback((speed: number) => {
    gameRef.current?.setSpeed(speed);
    setSnapshot((s) => ({ ...s, speed }));
  }, []);

  if (!isLandscape) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-b from-lime-400 to-green-500 p-8">
        <Head title="Music Game demo" />
        <div className="text-center">
          <div className="mb-6 text-6xl">📱</div>
          <h1 className="mb-4 text-3xl font-bold text-white">Rotate Your Device</h1>
          <p className="text-lg text-white/90">
            Please rotate to landscape mode to play the demo.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen w-screen flex-col overflow-hidden">
      <Head title="Music Game demo" />

      <div className="absolute inset-0 z-0">
        <MusicPracticeGame ref={gameRef} onStateChange={setSnapshot} />
      </div>

      {/* Top chrome */}
      <header className="relative z-20 flex shrink-0 items-center gap-3 px-4 pt-4 lg:px-6">
        <Link
          href={dashboard().url}
          className="group flex items-center gap-2 rounded-full bg-black/45 px-3 py-2 text-sm font-medium text-white/85 backdrop-blur-md transition-colors hover:bg-black/65"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          <span className="hidden sm:inline">Dashboard</span>
        </Link>

        <div className="flex items-center gap-2 rounded-full bg-black/45 px-3 py-1.5 text-white/85 backdrop-blur-md">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-lime-300 to-green-500 text-zinc-900">
            <AppLogoIcon className="h-4 w-4" />
          </span>
          <span className="hidden text-sm font-black tracking-tight md:inline">
            NoteFlow Demo
          </span>
        </div>

        <div className="flex-1" />

        <div className="rounded-2xl bg-black/55 px-4 py-1.5 backdrop-blur-md">
          <span className="font-mono text-xl font-black tracking-tight tabular-nums text-white">
            {formatScore(snapshot.score)}
          </span>
        </div>
      </header>

      <div className="pointer-events-none absolute right-4 top-[5.5rem] z-20 lg:right-6">
        <div className="pointer-events-auto">
          <SpeedSelector speed={snapshot.speed} onSpeedChange={handleSpeedChange} />
        </div>
      </div>

      {/* Bottom chrome */}
      <footer className="relative z-20 mt-auto flex shrink-0 items-center gap-3 px-4 pb-6 lg:px-6">
        <button
          onClick={handlePlayPause}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-lime-400 text-zinc-900 shadow-[0_8px_24px_-4px_rgba(184,243,74,0.55)] transition-all hover:scale-105 hover:bg-lime-300 active:scale-95"
          aria-label={snapshot.isPlaying ? 'Pause' : 'Play'}
        >
          {snapshot.isPlaying ? (
            <Pause className="h-6 w-6 fill-current" strokeWidth={0} />
          ) : (
            <Play className="h-6 w-6 translate-x-[2px] fill-current" strokeWidth={0} />
          )}
        </button>

        <button
          onClick={handleRestart}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white/75 backdrop-blur-md transition-colors hover:bg-black/75 hover:text-white"
          aria-label="Restart"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </footer>
    </div>
  );
}
