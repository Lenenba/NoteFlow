/**
 * MIDI Service
 * Handles MIDI device connection and note events
 */

interface MIDIDevice {
    id: string;
    name: string;
    manufacturer: string;
}

type NoteCallback = (noteNumber: number, velocity: number) => void;
type DeviceCallback = (devices: MIDIDevice[]) => void;

export class MIDIService {
    private midiAccess: MIDIAccess | null = null;
    private activeNotes: Set<number> = new Set();
    private devices: MIDIDevice[] = [];
    private onNoteOnCallback: NoteCallback | null = null;
    private onNoteOffCallback: NoteCallback | null = null;
    private onDeviceChangeCallback: DeviceCallback | null = null;

    /**
     * Initialize MIDI access
     */
    async initialize(): Promise<boolean> {
        try {
            if (!navigator.requestMIDIAccess) {
                console.warn('Web MIDI API not supported');
                return false;
            }

            this.midiAccess = await navigator.requestMIDIAccess();
            this.setupDevices();
            this.setupDeviceChangeListener();

            return true;
        } catch (error) {
            console.error('Failed to initialize MIDI:', error);

            return false;
        }
    }

    /**
     * Setup MIDI devices
     */
    private setupDevices(): void {
        if (!this.midiAccess) {
            return;
        }

        this.devices = [];

        // Get all input devices
        this.midiAccess.inputs.forEach((input) => {
            this.devices.push({
                id: input.id,
                name: input.name || 'Unknown Device',
                manufacturer: input.manufacturer || 'Unknown'
            });

            // Setup message handler
            input.onmidimessage = this.handleMIDIMessage.bind(this);
        });

        if (this.onDeviceChangeCallback) {
            this.onDeviceChangeCallback(this.devices);
        }
    }

    /**
     * Setup device change listener
     */
    private setupDeviceChangeListener(): void {
        if (!this.midiAccess) {
            return;
        }

        this.midiAccess.onstatechange = () => {
            this.setupDevices();
        };
    }

    /**
     * Handle MIDI message
     */
    private handleMIDIMessage(event: MIDIMessageEvent): void {
        if (!event.data || event.data.length < 3) {
            return;
        }

        const [status, noteNumber, velocity] = Array.from(event.data);
        const command = status >> 4;

        // Note On (command 9)
        if (command === 9 && velocity > 0) {
            this.activeNotes.add(noteNumber);

            if (this.onNoteOnCallback) {
                this.onNoteOnCallback(noteNumber, velocity);
            }
        } else if (command === 8 || (command === 9 && velocity === 0)) {
            // Note Off (command 8 or Note On with velocity 0)
            this.activeNotes.delete(noteNumber);

            if (this.onNoteOffCallback) {
                this.onNoteOffCallback(noteNumber, velocity);
            }
        }
    }

    /**
     * Get active notes
     */
    getActiveNotes(): number[] {
        return Array.from(this.activeNotes);
    }

    /**
     * Get connected devices
     */
    getDevices(): MIDIDevice[] {
        return this.devices;
    }

    /**
     * Set note on callback
     */
    setOnNoteOn(callback: NoteCallback): void {
        this.onNoteOnCallback = callback;
    }

    /**
     * Set note off callback
     */
    setOnNoteOff(callback: NoteCallback): void {
        this.onNoteOffCallback = callback;
    }

    /**
     * Set device change callback
     */
    setOnDeviceChange(callback: DeviceCallback): void {
        this.onDeviceChangeCallback = callback;
    }

    /**
     * Convert MIDI note numbers to note names
     */
    static noteNumbersToNames(noteNumbers: number[]): string[] {
        const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

        return noteNumbers.map(num => {
            const octave = Math.floor(num / 12) - 1;
            const noteName = noteNames[num % 12];

            return `${noteName}${octave}`;
        });
    }

    /**
     * Cleanup
     */
    destroy(): void {
        if (this.midiAccess) {
            this.midiAccess.inputs.forEach((input) => {
                input.onmidimessage = null;
            });
        }

        this.activeNotes.clear();
        this.devices = [];
        this.onNoteOnCallback = null;
        this.onNoteOffCallback = null;
        this.onDeviceChangeCallback = null;
    }
}

// Made with Bob
