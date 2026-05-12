/**
 * Game Feedback Badge Component
 * Displays large animated feedback labels (Perfect!, Good, Late, etc.)
 * positioned near the hit line and fading upward.
 */

import type { FeedbackEvent } from '@/types/musicGame';

interface GameFeedbackBadgeProps {
  feedback: FeedbackEvent[];
}

const STYLE_BY_TYPE: Record<
  FeedbackEvent['type'],
  { gradient: string; shadow: string }
> = {
  Perfect: {
    gradient: 'from-lime-200 via-lime-400 to-green-500',
    shadow: 'drop-shadow-[0_4px_18px_rgba(184,243,74,0.65)]',
  },
  Good: {
    gradient: 'from-emerald-200 via-emerald-400 to-emerald-500',
    shadow: 'drop-shadow-[0_4px_14px_rgba(16,185,129,0.55)]',
  },
  Late: {
    gradient: 'from-amber-200 via-amber-400 to-orange-500',
    shadow: 'drop-shadow-[0_4px_14px_rgba(245,158,11,0.55)]',
  },
  Wrong: {
    gradient: 'from-rose-200 via-rose-400 to-red-500',
    shadow: 'drop-shadow-[0_4px_14px_rgba(244,63,94,0.6)]',
  },
  Miss: {
    gradient: 'from-zinc-300 via-zinc-400 to-zinc-500',
    shadow: 'drop-shadow-[0_4px_10px_rgba(0,0,0,0.45)]',
  },
};

export function GameFeedbackBadge({ feedback }: GameFeedbackBadgeProps) {
  if (feedback.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {feedback.map((item) => {
        const style = STYLE_BY_TYPE[item.type];

        return (
          <div
            key={item.id}
            className="absolute"
            style={{
              left: `${item.x}px`,
              top: `${item.y}px`,
              transform: `translate(-50%, -50%) scale(${item.scale})`,
              opacity: item.opacity,
            }}
          >
            <div
              className={`bg-gradient-to-b bg-clip-text text-6xl font-black uppercase tracking-tight text-transparent ${style.gradient} ${style.shadow}`}
            >
              {item.type}!
            </div>
          </div>
        );
      })}
    </div>
  );
}
