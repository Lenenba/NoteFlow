/**
 * Combo Badge Component
 * Displays the current combo multiplier in a soft pill with a progress strip.
 */

interface ComboBadgeProps {
  combo: number;
  multiplier: number;
}

export function ComboBadge({ combo, multiplier }: ComboBadgeProps) {
  // Always render the badge so the layout is stable, even when combo is 0.
  const visible = combo > 0;

  return (
    <div
      className={`pointer-events-none absolute left-6 top-6 z-10 transition-opacity duration-200 ${
        visible ? 'opacity-100' : 'opacity-40'
      }`}
    >
      <div
        key={multiplier}
        className="animate-in zoom-in-95 duration-150 flex flex-col items-center rounded-[1.5rem] bg-black/55 px-7 py-3 shadow-[0_4px_24px_rgba(0,0,0,0.25)] backdrop-blur-md"
      >
        <div className="flex items-baseline gap-0.5 leading-none">
          <span className="text-[2.6rem] font-black tracking-tight text-white drop-shadow-md">
            {multiplier}
          </span>
          <span className="text-2xl font-bold text-white/85">x</span>
        </div>

        <div className="mt-1.5 h-[3px] w-full overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-gradient-to-r from-lime-300 via-lime-400 to-green-500 transition-all duration-300"
            style={{ width: `${Math.min(100, (combo % 5) * 20)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
