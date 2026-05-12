/**
 * Guitar Canvas - Yousician-style visualization with guitar strings
 */

import { useEffect, useRef } from 'react';

import type { GameSettings, SongEvent } from '@/types/music';

interface GuitarCanvasProps {
    events: SongEvent[];
    currentTime: number;
    isPlaying: boolean;
    duration: number;
    settings: GameSettings;
    lookaheadTime?: number;
}

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const STRING_COLORS = ['#E74C3C', '#E67E22', '#F39C12', '#27AE60', '#3498DB', '#9B59B6'];
const NOTE_COLORS = ['#2ECC71', '#3498DB', '#E67E22', '#9B59B6', '#E74C3C', '#F1C40F'];

// Finger colors (standard guitar fingering)
const FINGER_COLORS: Record<number, string> = {
    0: '#808080', // Thumb (gray)
    1: '#E67E22', // Index (orange)
    2: '#9B59B6', // Middle (purple)
    3: '#3498DB', // Ring (blue)
    4: '#E74C3C', // Pinky (red)
};

// Finger names for display
const FINGER_NAMES: Record<number, string> = {
    0: 'P', // Thumb (Pouce)
    1: 'i', // Index
    2: 'm', // Middle (Majeur)
    3: 'a', // Ring (Annulaire)
    4: 'c', // Pinky (Chico/auriculaire)
};

export default function GuitarCanvas({
    events,
    currentTime,
    isPlaying,
    duration,
    settings,
    lookaheadTime = 3,
}: GuitarCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const drawGuitarNeck = (ctx: CanvasRenderingContext2D): void => {
        const numStrings = 6;
        const stringSpacing = (CANVAS_HEIGHT - 100) / (numStrings + 1);
        const startY = 50;
        const fretWidth = 60;
        const numFrets = Math.floor(CANVAS_WIDTH / fretWidth);

        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
        gradient.addColorStop(0, '#1a1a1a');
        gradient.addColorStop(1, '#0a0a0a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Draw frets (vertical lines)
        for (let i = 0; i <= numFrets; i++) {
            const x = i * fretWidth;
            ctx.strokeStyle = i === 0 ? '#666' : '#333';
            ctx.lineWidth = i === 0 ? 3 : 1;
            ctx.beginPath();
            ctx.moveTo(x, startY);
            ctx.lineTo(x, CANVAS_HEIGHT - 50);
            ctx.stroke();

            // Fret numbers
            if (i > 0 && i % 2 === 0) {
                ctx.fillStyle = '#666';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(i.toString(), x, CANVAS_HEIGHT - 30);
            }
        }

        // Draw strings (horizontal lines)
        for (let i = 0; i < numStrings; i++) {
            const y = startY + (i + 1) * stringSpacing;
            const stringWidth = 1 + (numStrings - i) * 0.3;

            // String shadow
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.lineWidth = stringWidth + 2;
            ctx.beginPath();
            ctx.moveTo(0, y + 1);
            ctx.lineTo(CANVAS_WIDTH, y + 1);
            ctx.stroke();

            // String
            ctx.strokeStyle = STRING_COLORS[i];
            ctx.lineWidth = stringWidth;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(CANVAS_WIDTH, y);
            ctx.stroke();

            // String name
            ctx.fillStyle = STRING_COLORS[i];
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'right';
            ctx.fillText(['E', 'A', 'D', 'G', 'B', 'e'][i], 25, y + 5);
        }

        // Draw fret markers (dots)
        const markerFrets = [3, 5, 7, 9, 12];
        markerFrets.forEach((fret) => {
            const x = fret * fretWidth - fretWidth / 2;
            const y = CANVAS_HEIGHT / 2;
            ctx.fillStyle = '#444';
            ctx.beginPath();
            ctx.arc(x, y, 8, 0, Math.PI * 2);
            ctx.fill();
        });

        // Hit line (where notes should be played)
        const hitLineX = 150;
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 4;
        ctx.shadowColor = '#00ff00';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.moveTo(hitLineX, startY);
        ctx.lineTo(hitLineX, CANVAS_HEIGHT - 50);
        ctx.stroke();
        ctx.shadowBlur = 0;
    };

    const drawNotes = (ctx: CanvasRenderingContext2D): void => {
        const numStrings = 6;
        const stringSpacing = (CANVAS_HEIGHT - 100) / (numStrings + 1);
        const startY = 50;
        const hitLineX = 150;

        // Get visible events
        const visibleEvents = events.filter((event) => {
            const timeUntilEvent = event.start_time - currentTime;
            return timeUntilEvent >= -0.5 && timeUntilEvent <= lookaheadTime;
        });

        visibleEvents.forEach((event) => {
            const timeUntilEvent = event.start_time - currentTime;
            const x = hitLineX + timeUntilEvent * settings.scrollSpeed;

            // Distribute notes across strings based on track
            const stringIndex = event.track % numStrings;
            const y = startY + (stringIndex + 1) * stringSpacing;

            // Note size based on duration
            const noteWidth = Math.max(30, event.duration * 50);
            const noteHeight = 40;

            // Color based on chord
            const colorIndex = event.chord.charCodeAt(0) % NOTE_COLORS.length;
            const color = NOTE_COLORS[colorIndex];

            // Note shadow
            ctx.shadowColor = color;
            ctx.shadowBlur = 15;

            // Note background (3D effect)
            const gradient = ctx.createLinearGradient(x - noteWidth / 2, y - noteHeight / 2, x - noteWidth / 2, y + noteHeight / 2);
            gradient.addColorStop(0, color);
            gradient.addColorStop(0.5, color + 'CC');
            gradient.addColorStop(1, color + '88');

            ctx.fillStyle = gradient;
            ctx.fillRect(x - noteWidth / 2, y - noteHeight / 2, noteWidth, noteHeight);

            // Note border
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.strokeRect(x - noteWidth / 2, y - noteHeight / 2, noteWidth, noteHeight);

            ctx.shadowBlur = 0;

            // Chord text
            if (settings.showNotes) {
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 16px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(event.chord, x, y);
            }

            // Highlight if near hit line
            if (Math.abs(x - hitLineX) < 20) {
                ctx.strokeStyle = '#00ff00';
                ctx.lineWidth = 3;
                ctx.strokeRect(x - noteWidth / 2 - 2, y - noteHeight / 2 - 2, noteWidth + 4, noteHeight + 4);
            }
        });
    };

    const drawProgressBar = (ctx: CanvasRenderingContext2D): void => {
        const barHeight = 30;
        const barY = CANVAS_HEIGHT - barHeight;
        const progress = currentTime / duration;

        // Background
        ctx.fillStyle = '#222';
        ctx.fillRect(0, barY, CANVAS_WIDTH, barHeight);

        // Progress
        const gradient = ctx.createLinearGradient(0, barY, CANVAS_WIDTH * progress, barY);
        gradient.addColorStop(0, '#3498DB');
        gradient.addColorStop(0.5, '#2ECC71');
        gradient.addColorStop(1, '#F39C12');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, barY, CANVAS_WIDTH * progress, barHeight);

        // Border
        ctx.strokeStyle = '#444';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, barY, CANVAS_WIDTH, barHeight);
    };

    const drawFingerIndicators = (ctx: CanvasRenderingContext2D): void => {
        const numStrings = 6;
        const stringSpacing = (CANVAS_HEIGHT - 100) / (numStrings + 1);
        const startY = 50;
        const indicatorX = 40; // Position X of indicators (left side)
        const lookAheadTime = 2; // Seconds ahead to look

        // For each string
        for (let stringIndex = 0; stringIndex < numStrings; stringIndex++) {
            const stringY = startY + (stringIndex + 1) * stringSpacing;

            // Find the next note on this string
            const upcomingNotes = events.filter(
                (e) =>
                    e.track === stringIndex &&
                    e.start_time > currentTime &&
                    e.start_time < currentTime + lookAheadTime
            );

            if (upcomingNotes.length > 0) {
                const nextNote = upcomingNotes[0];
                const finger = nextNote.finger ?? 0;
                const fingerColor = FINGER_COLORS[finger];
                const fingerName = FINGER_NAMES[finger];

                // Calculate opacity based on proximity
                const timeUntilNote = nextNote.start_time - currentTime;
                const opacity = Math.max(0.3, 1 - timeUntilNote / lookAheadTime);

                // Background circle
                ctx.save();
                ctx.globalAlpha = opacity;
                ctx.fillStyle = fingerColor;
                ctx.beginPath();
                ctx.arc(indicatorX, stringY, 18, 0, Math.PI * 2);
                ctx.fill();

                // White border
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 2;
                ctx.stroke();

                // Finger number/letter
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 14px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(fingerName, indicatorX, stringY);

                // Pulse animation if very close
                if (timeUntilNote < 0.5) {
                    const pulseScale = 1 + Math.sin(Date.now() / 100) * 0.2;
                    ctx.beginPath();
                    ctx.arc(indicatorX, stringY, 18 * pulseScale, 0, Math.PI * 2);
                    ctx.strokeStyle = fingerColor;
                    ctx.lineWidth = 3;
                    ctx.globalAlpha = opacity * 0.5;
                    ctx.stroke();
                }

                ctx.restore();
            } else {
                // Show empty gray circle if no upcoming note
                ctx.save();
                ctx.globalAlpha = 0.2;
                ctx.strokeStyle = '#666';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(indicatorX, stringY, 18, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
            }
        }

        // Legend at top
        ctx.save();
        ctx.fillStyle = '#fff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Doigts', indicatorX, 25);
        ctx.restore();
    };

    const drawFingerPath = (ctx: CanvasRenderingContext2D): void => {
        const numStrings = 6;
        const stringSpacing = (CANVAS_HEIGHT - 100) / (numStrings + 1);
        const startY = 50;
        const lookAheadTime = 3;

        // Find upcoming notes
        const upcomingNotes = events
            .filter(
                (e) =>
                    e.start_time > currentTime &&
                    e.start_time < currentTime + lookAheadTime
            )
            .sort((a, b) => a.start_time - b.start_time)
            .slice(0, 5); // Limit to 5 notes

        if (upcomingNotes.length < 2) {
            return;
        }

        ctx.save();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.globalAlpha = 0.5;

        ctx.beginPath();

        upcomingNotes.forEach((note, index) => {
            if (note.track === undefined) {
                return;
            }

            const stringY = startY + (note.track + 1) * stringSpacing;
            const progress = (note.start_time - currentTime) / lookAheadTime;
            const x = CANVAS_WIDTH - progress * CANVAS_WIDTH;

            if (index === 0) {
                ctx.moveTo(x, stringY);

                // Starting circle
                ctx.save();
                ctx.setLineDash([]);
                ctx.fillStyle = '#fff';
                ctx.beginPath();
                ctx.arc(x, stringY, 8, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            } else {
                ctx.lineTo(x, stringY);
            }
        });

        ctx.stroke();
        ctx.restore();
    };

    const drawStringVibration = (
        ctx: CanvasRenderingContext2D,
        stringIndex: number,
        intensity: number
    ): void => {
        const numStrings = 6;
        const stringSpacing = (CANVAS_HEIGHT - 100) / (numStrings + 1);
        const startY = 50;
        const stringY = startY + (stringIndex + 1) * stringSpacing;

        ctx.save();
        ctx.strokeStyle = STRING_COLORS[stringIndex];
        ctx.lineWidth = 3;
        ctx.globalAlpha = intensity;

        // Sine wave to simulate vibration
        ctx.beginPath();

        for (let x = 0; x < CANVAS_WIDTH; x += 5) {
            const wave = Math.sin((x + Date.now()) / 20) * intensity * 5;

            if (x === 0) {
                ctx.moveTo(x, stringY + wave);
            } else {
                ctx.lineTo(x, stringY + wave);
            }
        }

        ctx.stroke();
        ctx.restore();
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

        // Clear and draw
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        drawGuitarNeck(ctx);
        drawFingerPath(ctx);
        drawNotes(ctx);
        drawProgressBar(ctx);
        drawFingerIndicators(ctx);

        // Draw string vibrations for recently played notes
        const recentlyPlayedNotes = events.filter((e) => {
            const timeSincePlayed = currentTime - e.start_time;

            return timeSincePlayed >= 0 && timeSincePlayed < 0.3;
        });

        recentlyPlayedNotes.forEach((note) => {
            if (note.track !== undefined) {
                const timeSincePlayed = currentTime - note.start_time;
                const intensity = Math.max(0, 1 - timeSincePlayed / 0.3);
                drawStringVibration(ctx, note.track, intensity);
            }
        });
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

    return (
        <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="mx-auto rounded-lg border-2 border-border bg-black shadow-2xl"
            style={{ maxWidth: '100%', height: 'auto' }}
        />
    );
}

// Made with Bob
