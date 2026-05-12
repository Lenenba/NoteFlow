<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('song_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('song_id')->constrained()->onDelete('cascade');
            $table->string('chord'); // Chord name (C, Dm, G7, etc.)
            $table->decimal('start_time', 8, 3); // Start time in seconds
            $table->decimal('duration', 8, 3); // Duration in seconds
            $table->integer('track')->default(0); // Track number for visual display
            $table->json('notes')->nullable(); // Optional: store individual notes for the chord
            $table->timestamps();

            $table->index('song_id');
            $table->index('start_time');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('song_events');
    }
};

// Made with Bob
