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
        Schema::create('practice_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('practice_session_id')->constrained()->onDelete('cascade');
            $table->foreignId('song_event_id')->constrained()->onDelete('cascade');
            $table->string('expected_chord');
            $table->string('played_chord')->nullable();
            $table->decimal('expected_time', 8, 3); // Expected time in seconds
            $table->decimal('played_time', 8, 3)->nullable(); // Actual time played
            $table->decimal('timing_offset', 8, 3)->nullable(); // Difference in ms
            $table->enum('result', ['perfect', 'good', 'early', 'late', 'wrong', 'miss']);
            $table->integer('points')->default(0);
            $table->timestamps();

            $table->index('practice_session_id');
            $table->index('song_event_id');
            $table->index('result');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('practice_results');
    }
};

// Made with Bob
