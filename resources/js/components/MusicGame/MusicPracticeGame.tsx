/**
 * Music Practice Game Component
 *
 * Architectural notes for smooth 60fps:
 * - Time advances inside a ref-backed loop; React state never updates per-frame.
 * - HUD-relevant state (score, combo, section) updates on event boundaries
 *   and on a 6Hz timer for the time clock.
 * - The canvas pulls time/particles via getters and renders independently.
 */

import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { Ref } from 'react';

import type {
  FeedbackEvent,
  GameTheme,
  Particle,
  SongData,
} from '@/types/musicGame';

import { GameFeedbackBadge } from './GameFeedbackBadge';
import { MusicHighwayCanvas } from './MusicHighwayCanvas';
import { demoSong, gameTheme } from '@/services/music/demoSong';
import {
  getComboMultiplier,
  getPointsForFeedback,
} from '@/services/music/gameTiming';

export interface MusicPracticeGameApi {
  getCurrentTime: () => number;
  pushFeedback: (type: FeedbackEvent['type']) => void;
  reset: () => void;
  play: () => void;
  pause: () => void;
  setSpeed: (speed: number) => void;
}

export interface GameSnapshot {
  currentTime: number;
  score: number;
  combo: number;
  multiplier: number;
  isPlaying: boolean;
  currentSectionLabel?: string;
  speed: number;
}

interface MusicPracticeGameProps {
  songData?: SongData;
  theme?: GameTheme;
  /** Generate random Perfect/Good/Late feedback at hit line (demo mode). */
  simulateFeedback?: boolean;
  /** Called ~6 times per second with the latest snapshot. */
  onStateChange?: (snapshot: GameSnapshot) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onRestart?: () => void;
  ref?: Ref<MusicPracticeGameApi>;
}

const HIT_WINDOW_SECONDS = 0.15;
const FEEDBACK_LIFETIME_MS = 1000;
const HUD_UPDATE_INTERVAL_MS = 160; // ~6Hz

interface GameRefState {
  currentTime: number;
  isPlaying: boolean;
  score: number;
  combo: number;
  maxCombo: number;
  speed: number;
  processedEvents: Set<number>;
  feedbacks: FeedbackEvent[];
  particles: Particle[];
}

function createRefState(): GameRefState {
  return {
    currentTime: 0,
    isPlaying: false,
    score: 0,
    combo: 0,
    maxCombo: 0,
    speed: 1,
    processedEvents: new Set(),
    feedbacks: [],
    particles: [],
  };
}

export function MusicPracticeGame({
  songData = demoSong,
  theme = gameTheme,
  simulateFeedback = true,
  onStateChange,
  onPlay,
  onPause,
  onRestart,
  ref,
}: MusicPracticeGameProps) {
  // High-frequency state lives in refs only (never triggers React re-renders).
  const refState = useRef<GameRefState>(createRefState());

  // Last animation timestamp for delta-time calculation.
  const lastFrameRef = useRef<number>(0);
  const rafRef = useRef<number | undefined>(undefined);

  // Tick state used purely to invalidate the feedback overlay; bumps when feedbacks change.
  const [feedbackTick, setFeedbackTick] = useState(0);

  // Throttled callback ref so the loop never closes on stale function identity.
  const onStateChangeRef = useRef(onStateChange);
  onStateChangeRef.current = onStateChange;

  const onPlayRef = useRef(onPlay);
  onPlayRef.current = onPlay;

  const onPauseRef = useRef(onPause);
  onPauseRef.current = onPause;

  const onRestartRef = useRef(onRestart);
  onRestartRef.current = onRestart;

  // Live event lists are referenced (not depended on) to avoid re-arming the loop.
  const allEvents = useMemo(
    () => [...songData.chords, ...songData.notes],
    [songData.chords, songData.notes],
  );
  const allEventsRef = useRef(allEvents);
  allEventsRef.current = allEvents;

  const songDurationRef = useRef(songData.duration);
  songDurationRef.current = songData.duration;

  const sectionsRef = useRef(songData.sections);
  sectionsRef.current = songData.sections;

  const simulateFeedbackRef = useRef(simulateFeedback);
  simulateFeedbackRef.current = simulateFeedback;

  // ============================================================================
  // Feedback / scoring helpers (called from inside the rAF loop, not React)
  // ============================================================================

  const spawnPerfectParticles = useCallback(() => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight * 0.78;

    for (let i = 0; i < 14; i++) {
      const angle = (Math.PI * 2 * i) / 14;
      const speed = 2 + Math.random() * 2;

      refState.current.particles.push({
        id: Date.now() + Math.random(),
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 3,
        opacity: 1,
        color: '#B8F34A',
        lifetime: 800,
        age: 0,
      });
    }
  }, []);

  const pushFeedbackInternal = useCallback(
    (type: FeedbackEvent['type']) => {
      const st = refState.current;

      st.feedbacks.push({
        id: Date.now() + Math.random(),
        type,
        timestamp: performance.now(),
        x: window.innerWidth / 2,
        y: window.innerHeight * 0.5,
        scale: 0.8,
        opacity: 1,
      });

      // Trigger a render so the feedback overlay shows up.
      setFeedbackTick((n) => (n + 1) % 100000);

      if (type === 'Perfect' || type === 'Good' || type === 'Late') {
        st.combo = Math.min(st.combo + 1, 9999);
        st.maxCombo = Math.max(st.maxCombo, st.combo);
        st.score += getPointsForFeedback(type, st.combo);

        if (type === 'Perfect') {
          spawnPerfectParticles();
        }
      } else {
        st.combo = 0;
      }
    },
    [spawnPerfectParticles],
  );

  // ============================================================================
  // Animation loop
  // ============================================================================

  useEffect(() => {
    lastFrameRef.current = performance.now();
    let lastHudEmit = 0;

    const loop = (now: number) => {
      const st = refState.current;
      const deltaMs = now - lastFrameRef.current;
      lastFrameRef.current = now;

      if (st.isPlaying) {
        st.currentTime = Math.min(
          st.currentTime + (deltaMs / 1000) * st.speed,
          songDurationRef.current,
        );

        if (st.currentTime >= songDurationRef.current) {
          st.isPlaying = false;
        }

        // Demo: generate random feedback at hit line when MIDI isn't driving us.
        if (simulateFeedbackRef.current) {
          for (const event of allEventsRef.current) {
            const timeToHit = event.startTime - st.currentTime;
            if (Math.abs(timeToHit) < HIT_WINDOW_SECONDS && !st.processedEvents.has(event.id)) {
              st.processedEvents.add(event.id);

              const choices: FeedbackEvent['type'][] = [
                'Perfect',
                'Perfect',
                'Perfect',
                'Good',
                'Late',
              ];
              const choice = choices[Math.floor(Math.random() * choices.length)];
              pushFeedbackInternal(choice);
            }
          }
        }
      }

      // Always animate particles & feedback (even when paused).
      if (st.particles.length > 0) {
        let needsRender = false;
        st.particles = st.particles.filter((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.age += deltaMs;
          p.opacity = Math.max(0, 1 - p.age / p.lifetime);
          if (p.age >= p.lifetime) {
            needsRender = true;
          }
          return p.age < p.lifetime;
        });
        if (needsRender && st.particles.length === 0) {
          setFeedbackTick((n) => (n + 1) % 100000);
        }
      }

      if (st.feedbacks.length > 0) {
        const before = st.feedbacks.length;
        st.feedbacks = st.feedbacks
          .map((f) => {
            const age = now - f.timestamp;
            const progress = age / FEEDBACK_LIFETIME_MS;
            return {
              ...f,
              y: f.y - deltaMs * 0.05,
              scale: 0.8 + Math.sin(progress * Math.PI) * 0.3,
              opacity: Math.max(0, 1 - progress),
            };
          })
          .filter((f) => now - f.timestamp < FEEDBACK_LIFETIME_MS);
        if (before !== st.feedbacks.length || st.feedbacks.length > 0) {
          // Always refresh the overlay so the React-rendered text animates.
          setFeedbackTick((n) => (n + 1) % 100000);
        }
      }

      // Emit HUD snapshot at ~6Hz (low frequency to keep React quiet).
      if (now - lastHudEmit > HUD_UPDATE_INTERVAL_MS) {
        lastHudEmit = now;
        const section = sectionsRef.current.find(
          (s) => st.currentTime >= s.startTime && st.currentTime < s.startTime + s.duration,
        );
        onStateChangeRef.current?.({
          currentTime: st.currentTime,
          score: st.score,
          combo: st.combo,
          multiplier: getComboMultiplier(st.combo),
          isPlaying: st.isPlaying,
          currentSectionLabel: section?.label,
          speed: st.speed,
        });
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current !== undefined) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [pushFeedbackInternal]);

  // ============================================================================
  // Imperative API
  // ============================================================================

  const handlePlay = useCallback(() => {
    refState.current.isPlaying = true;
    lastFrameRef.current = performance.now();
    onPlayRef.current?.();
  }, []);

  const handlePause = useCallback(() => {
    refState.current.isPlaying = false;
    onPauseRef.current?.();
  }, []);

  const handleReset = useCallback(() => {
    refState.current = createRefState();
    setFeedbackTick(0);
    onRestartRef.current?.();
  }, []);

  const handleSetSpeed = useCallback((speed: number) => {
    refState.current.speed = speed;
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      getCurrentTime: () => refState.current.currentTime,
      pushFeedback: pushFeedbackInternal,
      reset: handleReset,
      play: handlePlay,
      pause: handlePause,
      setSpeed: handleSetSpeed,
    }),
    [pushFeedbackInternal, handleReset, handlePlay, handlePause, handleSetSpeed],
  );

  // ============================================================================
  // Getters consumed by the canvas
  // ============================================================================

  const getCurrentTime = useCallback(() => refState.current.currentTime, []);
  const getParticles = useCallback(() => refState.current.particles, []);

  // feedbackTick is read here so React re-renders the feedback overlay layer.
  void feedbackTick;
  const currentFeedbacks = refState.current.feedbacks;

  return (
    <div className="relative h-full w-full overflow-hidden">
      <MusicHighwayCanvas
        chords={songData.chords}
        notes={songData.notes}
        getCurrentTime={getCurrentTime}
        getParticles={getParticles}
        theme={theme}
      />

      <GameFeedbackBadge feedback={currentFeedbacks} />
    </div>
  );
}
