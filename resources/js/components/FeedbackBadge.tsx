/**
 * Feedback Badge - Displays validation feedback with animations
 */

import { useEffect, useRef } from 'react';

import { Badge } from '@/components/ui/badge';
import type { FeedbackType } from '@/services/timingValidator';
import { TimingValidator } from '@/services/timingValidator';

interface FeedbackBadgeProps {
    feedback: FeedbackType | null;
    timingOffset?: number;
    onComplete?: () => void;
}

export default function FeedbackBadge({ feedback, timingOffset = 0, onComplete }: FeedbackBadgeProps) {
    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
        if (feedback && onComplete) {
            // Clear any existing timeout
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            // Set new timeout to call onComplete
            timeoutRef.current = setTimeout(() => {
                onComplete();
            }, 1800);
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [feedback, onComplete]);

    if (!feedback) {
        return null;
    }

    const message = TimingValidator.getFeedbackMessage(feedback, timingOffset);
    const color = TimingValidator.getFeedbackColor(feedback);

    const getVariant = (): 'default' | 'secondary' | 'destructive' | 'outline' => {
        switch (feedback) {
            case 'perfect':
            case 'good':
                return 'default';
            case 'early':
            case 'late':
                return 'secondary';
            case 'wrong':
            case 'miss':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    const getAnimationClass = (): string => {
        switch (feedback) {
            case 'perfect':
                return 'animate-bounce opacity-100 scale-125';
            case 'good':
                return 'animate-pulse opacity-100 scale-110';
            case 'wrong':
            case 'miss':
                return 'animate-shake opacity-100 scale-100';
            default:
                return 'opacity-100 scale-100';
        }
    };

    return (
        <div className="fixed left-1/2 top-1/4 z-50 -translate-x-1/2 transform">
            <Badge
                variant={getVariant()}
                className={`px-8 py-4 text-2xl font-bold transition-all duration-300 ${getAnimationClass()}`}
                style={{
                    backgroundColor: feedback === 'perfect' || feedback === 'good' ? color : undefined,
                    boxShadow: `0 0 20px ${color}`,
                }}
            >
                {message}
            </Badge>
        </div>
    );
}

// Made with Bob
