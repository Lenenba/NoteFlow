/**
 * Practice Show Page (game-first layout)
 * The music highway canvas occupies the full viewport. Header and footer
 * controls float over the canvas as semi-transparent layers, exactly like
 * a modern music-learning game.
 */

import { Head, Link } from '@inertiajs/react';
import {
  ArrowLeft,
  Guitar,
  Pause,
  Play,
  RotateCcw,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import AppLogoIcon from '@/components/app-logo-icon';
import { InstrumentView } from '@/components/MusicGame/InstrumentView';
import type { InstrumentType } from '@/components/MusicGame/InstrumentView';
import { MusicPracticeGame } from '@/components/MusicGame/MusicPracticeGame';
import type {
  GameSnapshot,
  MusicPracticeGameApi,
} from '@/components/MusicGame/MusicPracticeGame';
import { SpeedSelector } from '@/components/MusicGame/SpeedSelector';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { index as songsIndex } from '@/routes/songs';
import { gameTheme } from '@/services/music/demoSong';
import { formatScore, formatTime } from '@/services/music/gameTiming';
import {
  deriveSections,
  toChordEvents,
  toNoteEvents,
} from '@/services/music/songEventAdapter';
import { ChordRecognizer } from '@/services/chordRecognizer';
import { MIDIService } from '@/services/midiService';
import { TimingValidator } from '@/services/timingValidator';
import type { FeedbackType } from '@/services/timingValidator';
import type { FeedbackEvent, SongData } from '@/types/musicGame';
import type { Song, SongEvent } from '@/types/music';

interface Props {
  song: Song & { events: SongEvent[] };
}

function mapFeedback(feedback: FeedbackType): FeedbackEvent['type'] {
  switch (feedback) {
    case 'perfect':
      return 'Perfect';
    case 'good':
      return 'Good';
    case 'late':
    case 'early':
      return 'Late';
    case 'wrong':
      return 'Wrong';
    case 'miss':
      return 'Miss';
    default:
      return 'Good';
  }
}

const INITIAL_SNAPSHOT: GameSnapshot = {
  currentTime: 0,
  score: 0,
  combo: 0,
  multiplier: 1,
  isPlaying: false,
  speed: 1,
};

export default function Show({ song }: Props) {
  const [instrument, setInstrument] = useState<InstrumentType>('guitar');
  const [snapshot, setSnapshot] = useState<GameSnapshot>(INITIAL_SNAPSHOT);
  const [midiConnected, setMidiConnected] = useState(false);
  const [midiDevices, setMidiDevices] = useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const gameRef = useRef<MusicPracticeGameApi>(null);
  const midiServiceRef = useRef<MIDIService | null>(null);

  const songData: SongData = useMemo(() => {
    const events = song.events ?? [];
    return {
      title: song.title,
      bpm: song.bpm,
      sections: deriveSections(song.duration),
      chords: toChordEvents(events),
      notes: toNoteEvents(events),
      duration: song.duration,
    };
  }, [song]);

  // Derive current + next chord from currentTime.
  const { currentChord, nextChord } = useMemo(() => {
    const events = [...(song.events ?? [])].sort((a, b) => a.start_time - b.start_time);
    const now = snapshot.currentTime;

    let current: SongEvent | undefined;
    let next: SongEvent | undefined;

    for (const ev of events) {
      const end = ev.start_time + ev.duration;
      if (now >= ev.start_time && now < end) {
        current = ev;
      } else if (ev.start_time > now && !next) {
        next = ev;
      }
    }

    if (!current && events.length > 0 && now < events[0].start_time) {
      current = events[0];
      next = events[1];
    }

    return { currentChord: current?.chord, nextChord: next?.chord };
  }, [song.events, snapshot.currentTime]);

  // Init MIDI.
  useEffect(() => {
    let cancelled = false;
    const events = song.events ?? [];

    const init = async () => {
      const midiService = new MIDIService();
      const ok = await midiService.initialize();
      if (!ok || cancelled) {
        return;
      }

      midiServiceRef.current = midiService;
      setMidiConnected(true);
      setMidiDevices(midiService.getDevices().map((d) => d.name));

      midiService.setOnDeviceChange((devices) => {
        setMidiDevices(devices.map((d) => d.name));
      });

      midiService.setOnNoteOn(() => {
        const notes = midiService.getActiveNotes();
        if (notes.length < 2) {
          return;
        }
        const chordMatch = ChordRecognizer.recognizeChord(notes);
        if (!chordMatch) {
          return;
        }
        const game = gameRef.current;
        if (!game) {
          return;
        }
        const currentTime = game.getCurrentTime();
        const result = TimingValidator.validate(events, currentTime, chordMatch.chord);
        if (result) {
          game.pushFeedback(mapFeedback(result.feedback));
        }
      });
    };

    init();

    return () => {
      cancelled = true;
      midiServiceRef.current?.destroy();
      midiServiceRef.current = null;
    };
  }, [song.events]);

  const handleStateChange = useCallback((s: GameSnapshot) => {
    setSnapshot(s);
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

  return (
    <div className="dark relative flex h-screen w-screen flex-col overflow-hidden bg-zinc-950 text-zinc-50">
      <Head title={`Practice — ${song.title}`} />

      {/* ============ FULL-VIEWPORT GAME CANVAS (z-0) ============ */}
      <div className="absolute inset-0 z-0">
        <MusicPracticeGame
          ref={gameRef}
          songData={songData}
          theme={gameTheme}
          simulateFeedback={!midiConnected}
          onStateChange={handleStateChange}
        />
      </div>

      {/* ============ TOP CHROME (z-20) ============ */}
      <header className="relative z-20 flex shrink-0 items-center gap-3 px-4 pt-4 lg:px-6">
        {/* Back + brand */}
        <div className="flex items-center gap-2">
          <Link
            href={songsIndex().url}
            className="group flex items-center gap-2 rounded-full bg-black/45 px-3 py-2 text-sm font-medium text-white/85 backdrop-blur-md transition-colors hover:bg-black/65"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <span className="hidden sm:inline">Songs</span>
          </Link>

          <div className="flex items-center gap-2 rounded-full bg-black/45 px-3 py-1.5 text-white/85 backdrop-blur-md">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-lime-300 to-green-500 text-zinc-900">
              <AppLogoIcon className="h-4 w-4" />
            </span>
            <span className="hidden text-sm font-black tracking-tight md:inline">
              NoteFlow
            </span>
          </div>
        </div>

        {/* Title + subtitle (truncates) */}
        <div className="flex min-w-0 flex-1 items-center justify-center px-3">
          <div className="flex min-w-0 max-w-2xl flex-col items-center rounded-2xl bg-black/40 px-4 py-1.5 backdrop-blur-md">
            <div className="truncate text-sm font-bold tracking-tight text-white sm:text-base">
              {song.title}
            </div>
            <div className="truncate text-[10px] font-medium uppercase tracking-widest text-white/55">
              {song.bpm} BPM · {song.difficulty}
              {song.key ? ` · Key ${song.key}` : ''}
              {snapshot.currentSectionLabel ? ` · ${snapshot.currentSectionLabel}` : ''}
            </div>
          </div>
        </div>

        {/* Combo + Score + MIDI */}
        <div className="flex items-center gap-2">
          <ComboBadge combo={snapshot.combo} multiplier={snapshot.multiplier} />
          <ScoreBadge score={snapshot.score} />
        </div>
      </header>

      {/* ============ SECTION LABEL (centered, faint) ============ */}
      {snapshot.currentSectionLabel && (
        <div className="pointer-events-none absolute left-1/2 top-[18%] z-10 -translate-x-1/2">
          <span
            key={snapshot.currentSectionLabel}
            className="animate-in fade-in zoom-in-95 duration-500 text-3xl font-black tracking-wide text-white/35 drop-shadow-md"
          >
            {snapshot.currentSectionLabel}
          </span>
        </div>
      )}

      {/* ============ SPEED + INSTRUMENT (top-right floating) ============ */}
      <div className="pointer-events-none absolute right-4 top-[5.5rem] z-20 flex flex-col items-end gap-2 lg:right-6">
        <div className="pointer-events-auto">
          <SpeedSelector speed={snapshot.speed} onSpeedChange={handleSpeedChange} />
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-black/55 px-3 py-2 text-xs font-semibold text-white/80 backdrop-blur-md transition-colors hover:bg-black/75"
        >
          <Guitar className="h-3.5 w-3.5" />
          <span>{currentChord ?? '—'}</span>
          <span className="opacity-50">·</span>
          <span className="opacity-80 capitalize">{instrument}</span>
        </button>
      </div>

      {/* ============ MIDI STATUS (bottom-left of canvas, above controls) ============ */}
      <div className="pointer-events-none absolute bottom-[6.5rem] right-6 z-10">
        <MidiStatus connected={midiConnected} devices={midiDevices} />
      </div>

      {/* ============ BOTTOM CHROME (z-20) ============ */}
      <footer className="relative z-20 mt-auto flex shrink-0 flex-col gap-2 px-4 pb-4 lg:px-6">
        {/* Dense timeline */}
        <PracticeTimeline
          chords={songData.chords}
          notes={songData.notes}
          currentTime={snapshot.currentTime}
          duration={songData.duration}
        />

        <div className="flex items-center gap-3">
          {/* Play / restart */}
          <button
            onClick={handlePlayPause}
            className="group flex h-14 w-14 items-center justify-center rounded-full bg-lime-400 text-zinc-900 shadow-[0_8px_24px_-4px_rgba(184,243,74,0.55)] transition-all hover:scale-105 hover:bg-lime-300 active:scale-95"
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

          {/* Time display */}
          <div className="rounded-full bg-black/45 px-3 py-1.5 font-mono text-xs font-medium tabular-nums text-white/75 backdrop-blur-md">
            {formatTime(snapshot.currentTime)} / {formatTime(songData.duration)}
          </div>

          <div className="flex-1" />

          {/* Chord teaser */}
          {currentChord && (
            <div className="flex items-center gap-3 rounded-full bg-black/45 px-3 py-1.5 backdrop-blur-md">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/45">
                  Now
                </span>
                <span className="text-xl font-black tracking-tight text-white">
                  {currentChord}
                </span>
              </div>
              {nextChord && (
                <>
                  <span className="text-white/30">→</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-white/45">
                      Next
                    </span>
                    <span className="text-base font-bold text-white/80">
                      {nextChord}
                    </span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </footer>

      {/* ============ INSTRUMENT DRAWER (slide-out from right) ============ */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent
          side="right"
          className="w-full border-l-white/10 bg-zinc-950/95 backdrop-blur-xl sm:max-w-md md:max-w-lg"
        >
          <SheetTitle className="px-4 pt-4 text-white">Instrument</SheetTitle>
          <SheetDescription className="sr-only">
            Switch between instruments and see the chord shape for the current song event.
          </SheetDescription>
          <div className="flex-1 overflow-auto px-4 pb-4">
            <InstrumentView
              instrument={instrument}
              onInstrumentChange={setInstrument}
              chord={currentChord}
              nextChord={nextChord}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

// ============================================================================
// Sub-components
// ============================================================================

function ComboBadge({ combo, multiplier }: { combo: number; multiplier: number }) {
  return (
    <div
      key={multiplier}
      className="animate-in zoom-in-95 duration-150 flex flex-col items-center rounded-2xl bg-black/55 px-4 py-1.5 backdrop-blur-md"
    >
      <div className="flex items-baseline gap-0.5 leading-none">
        <span className="text-xl font-black tracking-tight text-white">
          {multiplier}
        </span>
        <span className="text-sm font-bold text-white/70">x</span>
      </div>
      <div className="mt-1 h-[2px] w-10 overflow-hidden rounded-full bg-white/15">
        <div
          className="h-full rounded-full bg-gradient-to-r from-lime-300 to-green-500"
          style={{ width: `${Math.min(100, (combo % 5) * 20)}%` }}
        />
      </div>
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  return (
    <div className="rounded-2xl bg-black/55 px-4 py-1.5 backdrop-blur-md">
      <span className="font-mono text-xl font-black tracking-tight tabular-nums text-white">
        {formatScore(score)}
      </span>
    </div>
  );
}

function MidiStatus({
  connected,
  devices,
}: {
  connected: boolean;
  devices: string[];
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium backdrop-blur-md ${
        connected
          ? 'bg-emerald-500/25 text-emerald-200 ring-1 ring-emerald-400/40'
          : 'bg-black/45 text-white/55'
      }`}
      title={devices.join(', ') || 'No MIDI device connected'}
    >
      {connected ? (
        <Wifi className="h-3 w-3" />
      ) : (
        <WifiOff className="h-3 w-3" />
      )}
      {connected ? 'MIDI live' : 'Demo mode'}
    </span>
  );
}

function PracticeTimeline({
  chords,
  notes,
  currentTime,
  duration,
}: {
  chords: { id: number; startTime: number; color: string }[];
  notes: { id: number; startTime: number; color: string }[];
  currentTime: number;
  duration: number;
}) {
  if (duration <= 0) {
    return null;
  }

  const progress = Math.min(100, (currentTime / duration) * 100);

  return (
    <div className="relative h-7 w-full overflow-hidden rounded-full bg-black/65 backdrop-blur-md">
      {Array.from({ length: 120 }).map((_, i) => {
        const pct = (i / 120) * 100;
        const h = 18 + ((i * 31) % 60);
        return (
          <div
            key={`f-${i}`}
            className="absolute top-1/2 -translate-y-1/2 rounded-sm bg-white/15"
            style={{ left: `${pct}%`, width: 1.5, height: `${h}%` }}
          />
        );
      })}

      {chords.map((c) => {
        const pct = (c.startTime / duration) * 100;
        return (
          <div
            key={`c-${c.id}`}
            className="absolute top-1/2 -translate-y-1/2 rounded-sm"
            style={{ left: `${pct}%`, width: 3, height: '100%', backgroundColor: c.color }}
          />
        );
      })}

      {notes.map((n) => {
        const pct = (n.startTime / duration) * 100;
        return (
          <div
            key={`n-${n.id}`}
            className="absolute top-1/2 -translate-y-1/2 rounded-sm"
            style={{ left: `${pct}%`, width: 2, height: '70%', backgroundColor: n.color, opacity: 0.85 }}
          />
        );
      })}

      <div
        className="absolute top-0 left-0 h-full bg-black/35"
        style={{ width: `${progress}%` }}
      />

      <div
        className="absolute top-0 h-full w-[3px] -translate-x-1/2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)]"
        style={{ left: `${progress}%` }}
      />
    </div>
  );
}

