/**
 * Game Canvas - Renders the animated chord blocks using Canvas API
 * Supports multiple instrument modes and scroll directions
 */

import { useEffect, useRef } from 'react';

import type { GameSettings, SongEvent } from '@/types/music';

interface GameCanvasProps {
    events: SongEvent[];
    currentTime: number;
    isPlaying: boolean;
    duration: number;
    settings: GameSettings;
    lookaheadTime?: number;
    onEventHit?: (event: SongEvent) => void;
}

interface ChordBlock {
    event: SongEvent;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
}

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const TRACK_WIDTH = 150;
const TRACK_SPACING = 20;
const BLOCK_HEIGHT = 60;
const BLOCK_WIDTH = 100;

export default function GameCanvas({
    events,
    currentTime,
    isPlaying,
    duration,
    settings,
    lookaheadTime = 3,
}: GameCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Get unique tracks from events
    const tracks = Array.from(new Set(events.map((e) => e.track))).sort();
    const trackCount = Math.max(tracks.length, 1);

    // Calculate positions based on scroll direction
    const isVertical = settings.scrollDirection === 'vertical';
    const HIT_LINE_POSITION = isVertical ? CANVAS_HEIGHT - 100 : 100;

    // Calculate track positions
    const totalTracksWidth = trackCount * TRACK_WIDTH + (trackCount - 1) * TRACK_SPACING;
    const startX = (CANVAS_WIDTH - totalTracksWidth) / 2;

    const getTrackX = (track: number): number => {
        const trackIndex = tracks.indexOf(track);

        return startX + trackIndex * (TRACK_WIDTH + TRACK_SPACING);
    };

    const getTrackY = (track: number): number => {
        const trackIndex = tracks.indexOf(track);

        return 50 + trackIndex * (TRACK_WIDTH + TRACK_SPACING);
    };

    const getChordColor = (chord: string): string => {
        // Simple color mapping based on chord name
        const hash = chord.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const hue = hash % 360;

        return `hsl(${hue}, 70%, 60%)`;
    };

    const calculateBlockPosition = (event: SongEvent): { x: number; y: number } => {
        const timeUntilEvent = event.start_time - currentTime;
        const pixelsFromHitLine = timeUntilEvent * settings.scrollSpeed;

        if (isVertical) {
            // Vertical scroll: blocks move from top to bottom
            return {
                x: getTrackX(event.track),
                y: HIT_LINE_POSITION - pixelsFromHitLine,
            };
        } else {
            // Horizontal scroll: blocks move from left to right
            return {
                x: HIT_LINE_POSITION + pixelsFromHitLine,
                y: getTrackY(event.track),
            };
        }
    };

    const drawBackground = (ctx: CanvasRenderingContext2D): void => {
        // Clear canvas
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        if (isVertical) {
            // Draw vertical tracks
            tracks.forEach((track) => {
                const x = getTrackX(track);
                ctx.fillStyle = '#1a1a1a';
                ctx.fillRect(x, 0, TRACK_WIDTH, CANVAS_HEIGHT);

                // Track border
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 2;
                ctx.strokeRect(x, 0, TRACK_WIDTH, CANVAS_HEIGHT);
            });

            // Draw horizontal hit line
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(0, HIT_LINE_POSITION);
            ctx.lineTo(CANVAS_WIDTH, HIT_LINE_POSITION);
            ctx.stroke();

            // Hit line glow
            ctx.shadowColor = '#00ff00';
            ctx.shadowBlur = 20;
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, HIT_LINE_POSITION);
            ctx.lineTo(CANVAS_WIDTH, HIT_LINE_POSITION);
            ctx.stroke();
            ctx.shadowBlur = 0;
        } else {
            // Draw horizontal tracks
            tracks.forEach((track) => {
                const y = getTrackY(track);
                ctx.fillStyle = '#1a1a1a';
                ctx.fillRect(0, y, CANVAS_WIDTH, TRACK_WIDTH);

                // Track border
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 2;
                ctx.strokeRect(0, y, CANVAS_WIDTH, TRACK_WIDTH);
            });

            // Draw vertical hit line
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(HIT_LINE_POSITION, 0);
            ctx.lineTo(HIT_LINE_POSITION, CANVAS_HEIGHT);
            ctx.stroke();

            // Hit line glow
            ctx.shadowColor = '#00ff00';
            ctx.shadowBlur = 20;
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(HIT_LINE_POSITION, 0);
            ctx.lineTo(HIT_LINE_POSITION, CANVAS_HEIGHT);
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
    };

    const drawChordBlock = (ctx: CanvasRenderingContext2D, block: ChordBlock): void => {
        const { x, y, width, height, color, event } = block;

        // Don't draw if off screen
        if (isVertical) {
            if (y + height < 0 || y > CANVAS_HEIGHT) {
                return;
            }
        } else {
            if (x + width < 0 || x > CANVAS_WIDTH) {
                return;
            }
        }

        // Block background
        ctx.fillStyle = color;
        ctx.fillRect(x, y, width, height);

        // Block border
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);

        // Chord text (if enabled)
        if (settings.showNotes) {
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 20px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(event.chord, x + width / 2, y + height / 2);
        }
    };

    const render = (): void => {
        const canvas = canvasRef.current;

        if (!canvas) {
            return;
        }

        const ctx = canvas.getContext('2d');

        if (!ctx) {
            return;
        }

        // Draw background
        drawBackground(ctx);

        // Get visible events (within lookahead time)
        const visibleEvents = events.filter((event) => {
            const timeUntilEvent = event.start_time - currentTime;

            return timeUntilEvent >= -1 && timeUntilEvent <= lookaheadTime;
        });

        // Draw chord blocks
        visibleEvents.forEach((event) => {
            const position = calculateBlockPosition(event);
            const block: ChordBlock = {
                event,
                x: position.x,
                y: position.y,
                width: isVertical ? TRACK_WIDTH : BLOCK_WIDTH,
                height: isVertical ? BLOCK_HEIGHT : TRACK_WIDTH,
                color: getChordColor(event.chord),
            };

            drawChordBlock(ctx, block);
        });

        // Draw progress bar
        const progressWidth = (currentTime / duration) * CANVAS_WIDTH;
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(0, CANVAS_HEIGHT - 5, progressWidth, 5);
    };

    // Animation loop
    useEffect(() => {
        let animationFrameId: number;

        const animate = (): void => {
            render();
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [currentTime, events, isPlaying, settings]);

    // Handle window resize
    useEffect(() => {
        const handleResize = (): void => {
            // Resize logic can be implemented here if needed
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="mx-auto rounded-lg border-2 border-border bg-black"
            style={{ maxWidth: '100%', height: 'auto' }}
        />
    );
}

// Made with Bob
