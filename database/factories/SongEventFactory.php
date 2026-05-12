<?php

namespace Database\Factories;

use App\Models\Song;
use App\Models\SongEvent;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SongEvent>
 */
class SongEventFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = SongEvent::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $chords = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'Cm', 'Dm', 'Em', 'Fm', 'Gm', 'Am', 'Bm', 'C7', 'D7', 'E7', 'F7', 'G7', 'A7', 'B7'];

        return [
            'song_id' => Song::factory(),
            'chord' => fake()->randomElement($chords),
            'start_time' => fake()->randomFloat(3, 0, 100),
            'duration' => fake()->randomFloat(3, 0.5, 4),
            'track' => fake()->numberBetween(0, 3),
            'notes' => null,
        ];
    }

    /**
     * Indicate a specific chord.
     */
    public function chord(string $chord): static
    {
        return $this->state(fn (array $attributes) => [
            'chord' => $chord,
        ]);
    }

    /**
     * Indicate a specific start time.
     */
    public function startTime(float $time): static
    {
        return $this->state(fn (array $attributes) => [
            'start_time' => $time,
        ]);
    }

    /**
     * Indicate a specific duration.
     */
    public function duration(float $duration): static
    {
        return $this->state(fn (array $attributes) => [
            'duration' => $duration,
        ]);
    }

    /**
     * Indicate a specific track.
     */
    public function track(int $track): static
    {
        return $this->state(fn (array $attributes) => [
            'track' => $track,
        ]);
    }
}

// Made with Bob
