import React from 'react';

interface HandIndicatorProps {
    activeFinger?: number; // 0-4
    position?: 'left' | 'right';
}

const FINGER_COLORS: Record<number, string> = {
    0: '#808080',
    1: '#E67E22',
    2: '#9B59B6',
    3: '#3498DB',
    4: '#E74C3C',
};

export const HandIndicator: React.FC<HandIndicatorProps> = ({
    activeFinger,
    position = 'right',
}) => {
    return (
        <div
            className={`
                absolute bottom-4 ${position === 'right' ? 'right-4' : 'left-4'}
                z-10 h-32 w-24
            `}
        >
            <svg
                viewBox="0 0 100 150"
                className="h-full w-full drop-shadow-lg"
            >
                {/* Palm */}
                <path
                    d="M 30 80 Q 25 100 30 120 L 70 120 Q 75 100 70 80 Z"
                    fill="#FFE0BD"
                    stroke="#D4A574"
                    strokeWidth="2"
                />

                {/* Thumb (0) */}
                <path
                    d="M 30 80 Q 20 70 15 60 L 20 50 Q 25 55 30 65 Z"
                    fill={activeFinger === 0 ? FINGER_COLORS[0] : '#FFE0BD'}
                    stroke="#D4A574"
                    strokeWidth="2"
                    className={activeFinger === 0 ? 'animate-pulse' : ''}
                />

                {/* Index (1) */}
                <rect
                    x="35"
                    y="20"
                    width="8"
                    height="60"
                    rx="4"
                    fill={activeFinger === 1 ? FINGER_COLORS[1] : '#FFE0BD'}
                    stroke="#D4A574"
                    strokeWidth="2"
                    className={activeFinger === 1 ? 'animate-pulse' : ''}
                />

                {/* Middle (2) */}
                <rect
                    x="46"
                    y="15"
                    width="8"
                    height="65"
                    rx="4"
                    fill={activeFinger === 2 ? FINGER_COLORS[2] : '#FFE0BD'}
                    stroke="#D4A574"
                    strokeWidth="2"
                    className={activeFinger === 2 ? 'animate-pulse' : ''}
                />

                {/* Ring (3) */}
                <rect
                    x="57"
                    y="20"
                    width="8"
                    height="60"
                    rx="4"
                    fill={activeFinger === 3 ? FINGER_COLORS[3] : '#FFE0BD'}
                    stroke="#D4A574"
                    strokeWidth="2"
                    className={activeFinger === 3 ? 'animate-pulse' : ''}
                />

                {/* Pinky (4) */}
                <rect
                    x="68"
                    y="30"
                    width="7"
                    height="50"
                    rx="3.5"
                    fill={activeFinger === 4 ? FINGER_COLORS[4] : '#FFE0BD'}
                    stroke="#D4A574"
                    strokeWidth="2"
                    className={activeFinger === 4 ? 'animate-pulse' : ''}
                />
            </svg>

            {/* Label */}
            <div className="mt-1 text-center text-xs text-white/70">
                Main {position === 'right' ? 'droite' : 'gauche'}
            </div>
        </div>
    );
};

// Made with Bob
