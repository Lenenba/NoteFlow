<?php

namespace Database\Factories;

use App\Models\Song;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Song>
 */
class SongFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Song::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => fake()->sentence(3),
            'description' => fake()->paragraph(),
            'bpm' => fake()->numberBetween(60, 180),
            'duration' => fake()->randomFloat(2, 30, 300),
            'key' => fake()->randomElement(['C', 'D', 'E', 'F', 'G', 'A', 'B', 'Cm', 'Dm', 'Em', 'Fm', 'Gm', 'Am', 'Bm']),
            'difficulty' => fake()->randomElement(['beginner', 'intermediate', 'advanced']),
            'is_public' => fake()->boolean(70),
        ];
    }

    /**
     * Indicate that the song is public.
     */
    public function public(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_public' => true,
        ]);
    }

    /**
     * Indicate that the song is for beginners.
     */
    public function beginner(): static
    {
        return $this->state(fn (array $attributes) => [
            'difficulty' => 'beginner',
            'bpm' => fake()->numberBetween(60, 100),
        ]);
    }

    /**
     * Indicate that the song is intermediate.
     */
    public function intermediate(): static
    {
        return $this->state(fn (array $attributes) => [
            'difficulty' => 'intermediate',
            'bpm' => fake()->numberBetween(100, 140),
        ]);
    }

    /**
     * Indicate that the song is advanced.
     */
    public function advanced(): static
    {
        return $this->state(fn (array $attributes) => [
            'difficulty' => 'advanced',
            'bpm' => fake()->numberBetween(140, 180),
        ]);
    }
}

// Made with Bob
