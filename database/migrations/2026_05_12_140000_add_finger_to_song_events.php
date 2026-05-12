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
        Schema::table('song_events', function (Blueprint $table) {
            $table->tinyInteger('finger')->nullable()->after('track')
                ->comment('Finger to use: 0=thumb, 1=index, 2=middle, 3=ring, 4=pinky');
            $table->json('finger_positions')->nullable()->after('finger')
                ->comment('Array of finger positions for chords');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('song_events', function (Blueprint $table) {
            $table->dropColumn(['finger', 'finger_positions']);
        });
    }
};

// Made with Bob
