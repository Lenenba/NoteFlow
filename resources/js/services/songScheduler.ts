/**
 * Song Scheduler Service
 * Manages song playback timing and event scheduling
 */

import type { SongEvent } from '@/types/music';

type TimeUpdateCallback = (time: number) => void;
type EventChangeCallback = (event: SongEvent | null) => void;
type CompleteCallback = () => void;

export class SongScheduler {
    private bpm: number;
    private duration: number;
    private events: SongEvent[];
    private currentTime: number = 0;
    private isPlaying: boolean = false;
    private startTimestamp: number = 0;
    private pausedAt: number = 0;
    private animationFrameId: number | null = null;
    private currentEventIndex: number = -1;

    private onTimeUpdate: TimeUpdateCallback | null = null;
    private onEventChange: EventChangeCallback | null = null;
    private onComplete: CompleteCallback | null = null;

    constructor(bpm: number, duration: number, events: SongEvent[]) {
        this.bpm = bpm;
        this.duration = duration;
        this.events = [...events].sort((a, b) => a.start_time - b.start_time);
    }

    /**
     * Start or resume playback
     */
    play(): void {
        if (this.isPlaying) {
            return;
        }

        this.isPlaying = true;
        this.startTimestamp = performance.now() - (this.pausedAt * 1000);
        this.tick();
    }

    /**
     * Pause playback
     */
    pause(): void {
        if (!this.isPlaying) {
            return;
        }

        this.isPlaying = false;
        this.pausedAt = this.currentTime;

        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    /**
     * Restart from beginning
     */
    restart(): void {
        this.pause();
        this.currentTime = 0;
        this.pausedAt = 0;
        this.currentEventIndex = -1;

        if (this.onTimeUpdate) {
            this.onTimeUpdate(0);
        }

        if (this.onEventChange) {
            this.onEventChange(null);
        }
    }

    /**
     * Main animation loop
     */
    private tick(): void {
        if (!this.isPlaying) {
            return;
        }

        const now = performance.now();
        this.currentTime = (now - this.startTimestamp) / 1000;

        // Check if song is complete
        if (this.currentTime >= this.duration) {
            this.currentTime = this.duration;
            this.isPlaying = false;

            if (this.onTimeUpdate) {
                this.onTimeUpdate(this.currentTime);
            }

            if (this.onComplete) {
                this.onComplete();
            }

            return;
        }

        // Update time
        if (this.onTimeUpdate) {
            this.onTimeUpdate(this.currentTime);
        }

        // Check for event changes
        this.checkEventChange();

        // Continue loop
        this.animationFrameId = requestAnimationFrame(() => this.tick());
    }

    /**
     * Check if current event has changed
     */
    private checkEventChange(): void {
        // Find the current event (the one that should be playing now)
        let newEventIndex = -1;

        for (let i = 0; i < this.events.length; i++) {
            const event = this.events[i];
            const eventEnd = event.start_time + (event.duration || 0);

            if (this.currentTime >= event.start_time && this.currentTime < eventEnd) {
                newEventIndex = i;
                break;
            }
        }

        // If event changed, notify
        if (newEventIndex !== this.currentEventIndex) {
            this.currentEventIndex = newEventIndex;

            if (this.onEventChange) {
                const currentEvent = newEventIndex >= 0 ? this.events[newEventIndex] : null;
                this.onEventChange(currentEvent);
            }
        }
    }

    /**
     * Get current playback time
     */
    getCurrentTime(): number {
        return this.currentTime;
    }

    /**
     * Get current event
     */
    getCurrentEvent(): SongEvent | null {
        return this.currentEventIndex >= 0 ? this.events[this.currentEventIndex] : null;
    }

    /**
     * Check if playing
     */
    getIsPlaying(): boolean {
        return this.isPlaying;
    }

    /**
     * Set time update callback
     */
    setOnTimeUpdate(callback: TimeUpdateCallback): void {
        this.onTimeUpdate = callback;
    }

    /**
     * Set event change callback
     */
    setOnEventChange(callback: EventChangeCallback): void {
        this.onEventChange = callback;
    }

    /**
     * Set complete callback
     */
    setOnComplete(callback: CompleteCallback): void {
        this.onComplete = callback;
    }

    /**
     * Cleanup
     */
    destroy(): void {
        this.pause();
        this.onTimeUpdate = null;
        this.onEventChange = null;
        this.onComplete = null;
    }
}

// Made with Bob
