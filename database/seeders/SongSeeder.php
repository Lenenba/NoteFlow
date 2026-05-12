<?php

namespace Database\Seeders;

use App\Models\Song;
use App\Models\SongEvent;
use App\Models\User;
use Illuminate\Database\Seeder;

class SongSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the first user or create one
        $user = User::first();

        if (!$user) {
            $user = User::factory()->create([
                'name' => 'Demo User',
                'email' => 'demo@example.com',
            ]);
        }

        // Create "Amazing Grace" demo song
        $amazingGrace = Song::create([
            'user_id' => null, // Public song, no specific owner
            'title' => 'Amazing Grace',
            'description' => 'A classic hymn perfect for beginners. Practice the simple chord progression at your own pace.',
            'bpm' => 80,
            'duration' => 32.0, // 32 seconds
            'key' => 'G',
            'difficulty' => 'beginner',
            'is_public' => true,
        ]);

        // Create chord progression for Amazing Grace
        // Simple 4-chord progression: G - C - G - D - G - C - G - D - G
        // Each chord lasts 4 beats (3 seconds at 80 BPM)
        $chordProgression = [
            ['chord' => 'G', 'start_time' => 0.0, 'duration' => 3.0, 'track' => 0],
            ['chord' => 'C', 'start_time' => 3.0, 'duration' => 3.0, 'track' => 1],
            ['chord' => 'G', 'start_time' => 6.0, 'duration' => 3.0, 'track' => 0],
            ['chord' => 'D', 'start_time' => 9.0, 'duration' => 3.0, 'track' => 2],
            ['chord' => 'G', 'start_time' => 12.0, 'duration' => 3.0, 'track' => 0],
            ['chord' => 'C', 'start_time' => 15.0, 'duration' => 3.0, 'track' => 1],
            ['chord' => 'G', 'start_time' => 18.0, 'duration' => 3.0, 'track' => 0],
            ['chord' => 'D', 'start_time' => 21.0, 'duration' => 3.0, 'track' => 2],
            ['chord' => 'G', 'start_time' => 24.0, 'duration' => 4.0, 'track' => 0],
            ['chord' => 'C', 'start_time' => 28.0, 'duration' => 4.0, 'track' => 1],
        ];

        foreach ($chordProgression as $event) {
            SongEvent::create([
                'song_id' => $amazingGrace->id,
                'chord' => $event['chord'],
                'start_time' => $event['start_time'],
                'duration' => $event['duration'],
                'track' => $event['track'],
            ]);
        }

        // Create "Twinkle Twinkle Little Star" - Another beginner song
        $twinkleTwinkle = Song::create([
            'user_id' => null,
            'title' => 'Twinkle Twinkle Little Star',
            'description' => 'A simple children\'s song with basic chords. Great for absolute beginners.',
            'bpm' => 90,
            'duration' => 24.0,
            'key' => 'C',
            'difficulty' => 'beginner',
            'is_public' => true,
        ]);

        // Chord progression: C - F - C - G - C - F - C - G - C
        $twinkleProgression = [
            ['chord' => 'C', 'start_time' => 0.0, 'duration' => 2.67, 'track' => 0],
            ['chord' => 'F', 'start_time' => 2.67, 'duration' => 2.67, 'track' => 1],
            ['chord' => 'C', 'start_time' => 5.34, 'duration' => 2.67, 'track' => 0],
            ['chord' => 'G', 'start_time' => 8.01, 'duration' => 2.67, 'track' => 2],
            ['chord' => 'C', 'start_time' => 10.68, 'duration' => 2.67, 'track' => 0],
            ['chord' => 'F', 'start_time' => 13.35, 'duration' => 2.67, 'track' => 1],
            ['chord' => 'C', 'start_time' => 16.02, 'duration' => 2.67, 'track' => 0],
            ['chord' => 'G', 'start_time' => 18.69, 'duration' => 2.67, 'track' => 2],
            ['chord' => 'C', 'start_time' => 21.36, 'duration' => 2.64, 'track' => 0],
        ];

        foreach ($twinkleProgression as $event) {
            SongEvent::create([
                'song_id' => $twinkleTwinkle->id,
                'chord' => $event['chord'],
                'start_time' => $event['start_time'],
                'duration' => $event['duration'],
                'track' => $event['track'],
            ]);
        }

        // Create "Let It Be" - Intermediate song
        $letItBe = Song::create([
            'user_id' => null,
            'title' => 'Let It Be',
            'description' => 'A Beatles classic with a beautiful chord progression. Intermediate level.',
            'bpm' => 72,
            'duration' => 40.0,
            'key' => 'C',
            'difficulty' => 'intermediate',
            'is_public' => true,
        ]);

        // Chord progression: C - G - Am - F - C - G - F - C
        $letItBeProgression = [
            ['chord' => 'C', 'start_time' => 0.0, 'duration' => 3.33, 'track' => 0],
            ['chord' => 'G', 'start_time' => 3.33, 'duration' => 3.33, 'track' => 1],
            ['chord' => 'Am', 'start_time' => 6.66, 'duration' => 3.33, 'track' => 2],
            ['chord' => 'F', 'start_time' => 9.99, 'duration' => 3.33, 'track' => 3],
            ['chord' => 'C', 'start_time' => 13.32, 'duration' => 3.33, 'track' => 0],
            ['chord' => 'G', 'start_time' => 16.65, 'duration' => 3.33, 'track' => 1],
            ['chord' => 'F', 'start_time' => 19.98, 'duration' => 3.33, 'track' => 3],
            ['chord' => 'C', 'start_time' => 23.31, 'duration' => 3.33, 'track' => 0],
            ['chord' => 'C', 'start_time' => 26.64, 'duration' => 3.33, 'track' => 0],
            ['chord' => 'G', 'start_time' => 29.97, 'duration' => 3.33, 'track' => 1],
            ['chord' => 'Am', 'start_time' => 33.30, 'duration' => 3.33, 'track' => 2],
            ['chord' => 'F', 'start_time' => 36.63, 'duration' => 3.37, 'track' => 3],
        ];

        foreach ($letItBeProgression as $event) {
            SongEvent::create([
                'song_id' => $letItBe->id,
                'chord' => $event['chord'],
                'start_time' => $event['start_time'],
                'duration' => $event['duration'],
                'track' => $event['track'],
            ]);
        }

        $this->command->info('Successfully seeded 3 demo songs with chord progressions!');
    }
}

// Made with Bob
