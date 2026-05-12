<?php

namespace App\Http\Controllers;

use App\Models\PracticeSession;
use App\Models\Song;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PracticeSessionController extends Controller
{
    /**
     * Display a listing of practice sessions for the authenticated user.
     */
    public function index(Request $request)
    {
        $sessions = PracticeSession::with('song')
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'sessions' => $sessions,
        ]);
    }

    /**
     * Store a newly created practice session.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'song_id' => 'required|exists:songs,id',
        ]);

        $session = PracticeSession::create([
            'user_id' => $request->user()->id,
            'song_id' => $validated['song_id'],
            'started_at' => now(),
        ]);

        return response()->json([
            'session' => $session,
        ], 201);
    }

    /**
     * Display the specified practice session.
     */
    public function show(PracticeSession $practiceSession)
    {
        $this->authorize('view', $practiceSession);

        $practiceSession->load(['song', 'results.songEvent']);

        return response()->json([
            'session' => $practiceSession,
        ]);
    }

    /**
     * Update the specified practice session with results.
     */
    public function update(Request $request, PracticeSession $practiceSession)
    {
        $this->authorize('update', $practiceSession);

        $validated = $request->validate([
            'score' => 'required|integer|min:0',
            'accuracy' => 'required|numeric|min:0|max:100',
            'max_streak' => 'required|integer|min:0',
            'perfect_count' => 'required|integer|min:0',
            'good_count' => 'required|integer|min:0',
            'early_count' => 'required|integer|min:0',
            'late_count' => 'required|integer|min:0',
            'wrong_count' => 'required|integer|min:0',
            'miss_count' => 'required|integer|min:0',
            'total_events' => 'required|integer|min:0',
            'results' => 'required|array',
            'results.*.song_event_id' => 'required|exists:song_events,id',
            'results.*.expected_chord' => 'required|string',
            'results.*.played_chord' => 'nullable|string',
            'results.*.expected_time' => 'required|numeric',
            'results.*.played_time' => 'nullable|numeric',
            'results.*.timing_offset' => 'nullable|numeric',
            'results.*.result' => 'required|in:perfect,good,early,late,wrong,miss',
            'results.*.points' => 'required|integer',
        ]);

        DB::transaction(function () use ($practiceSession, $validated) {
            // Update session
            $practiceSession->update([
                'score' => $validated['score'],
                'accuracy' => $validated['accuracy'],
                'max_streak' => $validated['max_streak'],
                'perfect_count' => $validated['perfect_count'],
                'good_count' => $validated['good_count'],
                'early_count' => $validated['early_count'],
                'late_count' => $validated['late_count'],
                'wrong_count' => $validated['wrong_count'],
                'miss_count' => $validated['miss_count'],
                'total_events' => $validated['total_events'],
                'completed_at' => now(),
            ]);

            // Create practice results
            foreach ($validated['results'] as $result) {
                $practiceSession->results()->create([
                    'song_event_id' => $result['song_event_id'],
                    'expected_chord' => $result['expected_chord'],
                    'played_chord' => $result['played_chord'] ?? null,
                    'expected_time' => $result['expected_time'],
                    'played_time' => $result['played_time'] ?? null,
                    'timing_offset' => $result['timing_offset'] ?? null,
                    'result' => $result['result'],
                    'points' => $result['points'],
                ]);
            }
        });

        return response()->json([
            'session' => $practiceSession->fresh(['results']),
            'message' => 'Practice session completed successfully!',
        ]);
    }

    /**
     * Get statistics for a user's practice sessions.
     */
    public function statistics(Request $request)
    {
        $userId = $request->user()->id;

        $stats = [
            'total_sessions' => PracticeSession::where('user_id', $userId)->count(),
            'completed_sessions' => PracticeSession::where('user_id', $userId)
                ->whereNotNull('completed_at')
                ->count(),
            'total_practice_time' => PracticeSession::where('user_id', $userId)
                ->whereNotNull('completed_at')
                ->get()
                ->sum(fn ($session) => $session->duration ?? 0),
            'average_accuracy' => PracticeSession::where('user_id', $userId)
                ->whereNotNull('completed_at')
                ->avg('accuracy'),
            'best_streak' => PracticeSession::where('user_id', $userId)
                ->max('max_streak'),
            'total_perfect' => PracticeSession::where('user_id', $userId)
                ->sum('perfect_count'),
            'total_good' => PracticeSession::where('user_id', $userId)
                ->sum('good_count'),
            'recent_sessions' => PracticeSession::with('song')
                ->where('user_id', $userId)
                ->whereNotNull('completed_at')
                ->orderBy('completed_at', 'desc')
                ->limit(10)
                ->get(),
        ];

        return response()->json($stats);
    }

    /**
     * Remove the specified practice session.
     */
    public function destroy(PracticeSession $practiceSession)
    {
        $this->authorize('delete', $practiceSession);

        $practiceSession->delete();

        return response()->json([
            'message' => 'Practice session deleted successfully!',
        ]);
    }
}

// Made with Bob
