/**
 * Strum Indicator Component
 * Bottom-right hand icon with colored finger bars representing strum intensity.
 */

interface StrumIndicatorProps {
  isActive?: boolean;
}

const FINGER_COLORS = ['#FF7A7A', '#FFB54A', '#F6E94A', '#79C928', '#009FE3'];
const FINGER_HEIGHTS = [10, 16, 20, 16, 12];

export function StrumIndicator({ isActive = false }: StrumIndicatorProps) {
  return (
    <div className="pointer-events-none absolute bottom-6 right-6 z-10">
      <div className="flex flex-col items-center gap-1.5">
        {/* Finger bars */}
        <div className="flex items-end gap-[3px]">
          {FINGER_HEIGHTS.map((h, i) => (
            <div
              key={i}
              className={`w-[5px] rounded-full transition-all duration-150 ${
                isActive ? 'shadow-[0_0_6px_currentColor]' : ''
              }`}
              style={{
                height: `${h + (isActive ? 4 : 0)}px`,
                color: FINGER_COLORS[i],
                backgroundColor: isActive ? FINGER_COLORS[i] : `${FINGER_COLORS[i]}AA`,
              }}
            />
          ))}
        </div>

        {/* Hand glyph */}
        <div
          className={`relative flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md transition-all ${
            isActive ? 'scale-110 bg-white shadow-[0_0_14px_rgba(255,255,255,0.7)]' : 'bg-black/55'
          }`}
        >
          <HandIcon active={isActive} />
        </div>
      </div>
    </div>
  );
}

/**
 * Stylized 5-finger hand glyph drawn inline so we can color it precisely.
 */
function HandIcon({ active }: { active: boolean }) {
  const stroke = active ? '#222' : '#FFFFFF';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M9 11V6a1.5 1.5 0 0 1 3 0v5" />
      <path d="M12 11V4.5a1.5 1.5 0 0 1 3 0V11" />
      <path d="M15 11V6.5a1.5 1.5 0 0 1 3 0V13" />
      <path d="M18 13a3 3 0 1 1-6 0" />
      <path d="M9 11V8a1.5 1.5 0 0 0-3 0v8a6 6 0 0 0 12 0V11" />
    </svg>
  );
}
