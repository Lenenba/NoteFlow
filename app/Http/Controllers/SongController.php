<?php

namespace App\Http\Controllers;

use App\Models\Song;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SongController extends Controller
{
    /**
     * Display a listing of songs.
     */
    public function index(Request $request): Response
    {
        $query = Song::with('events')
            ->where('is_public', true)
            ->orWhere('user_id', $request->user()?->id);

        // Filter by difficulty if provided
        if ($request->has('difficulty')) {
            $query->where('difficulty', $request->difficulty);
        }

        // Search by title
        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        $songs = $query->orderBy('created_at', 'desc')
            ->paginate(12)
            ->through(fn ($song) => [
                'id' => $song->id,
                'title' => $song->title,
                'description' => $song->description,
                'bpm' => $song->bpm,
                'duration' => $song->duration,
                'key' => $song->key,
                'difficulty' => $song->difficulty,
                'is_public' => $song->is_public,
                'total_events' => $song->events->count(),
                'created_at' => $song->created_at->toDateTimeString(),
            ]);

        return Inertia::render('Songs/Index', [
            'songs' => $songs,
            'filters' => $request->only(['difficulty', 'search']),
        ]);
    }

    /**
     * Show the form for creating a new song.
     */
    public function create(): Response
    {
        return Inertia::render('Songs/Create');
    }

    /**
     * Store a newly created song in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'bpm' => 'required|integer|min:40|max:240',
            'duration' => 'required|numeric|min:1',
            'key' => 'nullable|string|max:10',
            'difficulty' => 'required|in:beginner,intermediate,advanced',
            'is_public' => 'boolean',
            'events' => 'array',
            'events.*.chord' => 'required|string|max:10',
            'events.*.start_time' => 'required|numeric|min:0',
            'events.*.duration' => 'required|numeric|min:0.1',
            'events.*.track' => 'required|integer|min:0|max:3',
        ]);

        $song = $request->user()->songs()->create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'bpm' => $validated['bpm'],
            'duration' => $validated['duration'],
            'key' => $validated['key'] ?? null,
            'difficulty' => $validated['difficulty'],
            'is_public' => $validated['is_public'] ?? true,
        ]);

        // Create events if provided
        if (isset($validated['events']) && is_array($validated['events'])) {
            foreach ($validated['events'] as $eventData) {
                $song->events()->create($eventData);
            }
        }

        return redirect()->route('songs.show', $song)
            ->with('success', 'Song created successfully!');
    }

    /**
     * Display the specified song.
     */
    public function show(Song $song): Response
    {
        $song->load('events');

        return Inertia::render('Songs/Show', [
            'song' => [
                'id' => $song->id,
                'title' => $song->title,
                'description' => $song->description,
                'bpm' => $song->bpm,
                'duration' => $song->duration,
                'key' => $song->key,
                'difficulty' => $song->difficulty,
                'is_public' => $song->is_public,
                'events' => $song->events->map(fn ($event) => [
                    'id' => $event->id,
                    'chord' => $event->chord,
                    'start_time' => $event->start_time,
                    'duration' => $event->duration,
                    'track' => $event->track,
                    'notes' => $event->notes,
                ]),
                'total_events' => $song->events->count(),
            ],
        ]);
    }

    /**
     * Show the practice page for a song.
     */
    public function practice(Song $song): Response
    {
        $song->load('events');

        return Inertia::render('Practice/Show', [
            'song' => [
                'id' => $song->id,
                'title' => $song->title,
                'description' => $song->description,
                'bpm' => $song->bpm,
                'duration' => $song->duration,
                'key' => $song->key,
                'difficulty' => $song->difficulty,
                'events' => $song->events->map(fn ($event) => [
                    'id' => $event->id,
                    'chord' => $event->chord,
                    'start_time' => (float) $event->start_time,
                    'duration' => (float) $event->duration,
                    'track' => $event->track,
                ]),
                'total_events' => $song->events->count(),
            ],
        ]);
    }

    /**
     * Show the form for editing the specified song.
     */
    public function edit(Song $song): Response
    {
        $this->authorize('update', $song);

        $song->load('events');

        return Inertia::render('Songs/Edit', [
            'song' => [
                'id' => $song->id,
                'title' => $song->title,
                'description' => $song->description,
                'bpm' => $song->bpm,
                'duration' => $song->duration,
                'key' => $song->key,
                'difficulty' => $song->difficulty,
                'is_public' => $song->is_public,
                'events' => $song->events,
            ],
        ]);
    }

    /**
     * Update the specified song in storage.
     */
    public function update(Request $request, Song $song)
    {
        $this->authorize('update', $song);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'bpm' => 'required|integer|min:40|max:240',
            'duration' => 'required|numeric|min:1',
            'key' => 'nullable|string|max:10',
            'difficulty' => 'required|in:beginner,intermediate,advanced',
            'is_public' => 'boolean',
        ]);

        $song->update($validated);

        return redirect()->route('songs.show', $song)
            ->with('success', 'Song updated successfully!');
    }

    /**
     * Remove the specified song from storage.
     */
    public function destroy(Song $song)
    {
        $this->authorize('delete', $song);

        $song->delete();

        return redirect()->route('songs.index')
            ->with('success', 'Song deleted successfully!');
    }
}

// Made with Bob
