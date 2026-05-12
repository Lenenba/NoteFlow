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
        Schema::create('practice_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('song_id')->constrained()->onDelete('cascade');
            $table->integer('score')->default(0);
            $table->decimal('accuracy', 5, 2)->default(0); // Percentage (0-100)
            $table->integer('max_streak')->default(0);
            $table->integer('perfect_count')->default(0);
            $table->integer('good_count')->default(0);
            $table->integer('early_count')->default(0);
            $table->integer('late_count')->default(0);
            $table->integer('wrong_count')->default(0);
            $table->integer('miss_count')->default(0);
            $table->integer('total_events')->default(0);
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->index('user_id');
            $table->index('song_id');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('practice_sessions');
    }
};

// Made with Bob
