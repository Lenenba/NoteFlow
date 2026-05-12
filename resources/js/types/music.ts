export interface Song {
    id: number;
    title: string;
    description: string | null;
    bpm: number;
    duration: number;
    key: string | null;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    is_public: boolean;
    total_events: number;
    created_at: string;
    events?: SongEvent[];
}

export interface FingerPosition {
    finger: number; // 0=thumb, 1=index, 2=middle, 3=ring, 4=pinky
    string: number; // 0-5 (E, A, D, G, B, e)
    fret: number;   // 0-24
}

export interface SongEvent {
    id: number;
    song_id: number;
    chord: string;
    start_time: number;
    duration: number;
    track: number;
    notes?: string[] | null;
    finger?: number; // Finger to use for single notes (0-4)
    finger_positions?: FingerPosition[]; // For chords with multiple fingers
}

export interface PracticeSession {
    id: number;
    user_id: number;
    song_id: number;
    score: number;
    accuracy: number;
    max_streak: number;
    perfect_count: number;
    good_count: number;
    early_count: number;
    late_count: number;
    wrong_count: number;
    miss_count: number;
    total_events: number;
    started_at: string | null;
    completed_at: string | null;
    created_at: string;
    updated_at: string;
    song?: Song;
    results?: PracticeResult[];
}

export interface PracticeResult {
    id: number;
    practice_session_id: number;
    song_event_id: number;
    expected_chord: string;
    played_chord: string | null;
    expected_time: number;
    played_time: number | null;
    timing_offset: number | null;
    result: 'perfect' | 'good' | 'early' | 'late' | 'wrong' | 'miss';
    points: number;
}

export interface PaginatedSongs {
    data: Song[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface SongFilters {
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    search?: string;
}

export type InstrumentMode = 'piano' | 'guitar' | 'drums' | 'bass';
export type ScrollDirection = 'vertical' | 'horizontal';

export interface GameSettings {
    instrumentMode: InstrumentMode;
    scrollDirection: ScrollDirection;
    scrollSpeed: number;
    showNotes: boolean;
    showFretNumbers: boolean; // For guitar mode
    showKeyboard: boolean; // For piano mode
}

export const DEFAULT_GAME_SETTINGS: GameSettings = {
    instrumentMode: 'piano',
    scrollDirection: 'vertical',
    scrollSpeed: 200,
    showNotes: true,
    showFretNumbers: true,
    showKeyboard: true,
};

// Made with Bob
