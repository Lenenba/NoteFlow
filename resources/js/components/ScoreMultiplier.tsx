import React from 'react';

interface ScoreMultiplierProps {
    multiplier: number;
    streak: number;
}

export const ScoreMultiplier: React.FC<ScoreMultiplierProps> = ({
    multiplier,
    streak,
}) => {
    return (
        <div className="absolute left-4 top-4 z-10">
            <div
                className={`
                    rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 px-6 py-3 shadow-lg
                    transition-all duration-300
                    ${multiplier > 1 ? 'scale-110' : 'scale-100'}
                `}
            >
                <div className="text-center">
                    <div className="text-3xl font-bold text-white">
                        {multiplier}x
                    </div>
                    <div className="text-xs text-white/80">{streak} notes</div>
                </div>
            </div>

            {/* Particle animation when multiplier increases */}
            {multiplier > 1 && (
                <div className="pointer-events-none absolute inset-0">
                    {[...Array(8)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute h-2 w-2 animate-ping rounded-full bg-yellow-300"
                            style={{
                                top: '50%',
                                left: '50%',
                                animationDelay: `${i * 0.1}s`,
                                transform: `rotate(${i * 45}deg) translateX(30px)`,
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// Made with Bob
