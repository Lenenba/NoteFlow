<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PracticeSession extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'song_id',
        'score',
        'accuracy',
        'max_streak',
        'perfect_count',
        'good_count',
        'early_count',
        'late_count',
        'wrong_count',
        'miss_count',
        'total_events',
        'started_at',
        'completed_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'score' => 'integer',
        'accuracy' => 'decimal:2',
        'max_streak' => 'integer',
        'perfect_count' => 'integer',
        'good_count' => 'integer',
        'early_count' => 'integer',
        'late_count' => 'integer',
        'wrong_count' => 'integer',
        'miss_count' => 'integer',
        'total_events' => 'integer',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    /**
     * Get the user that owns the session.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the song for the session.
     */
    public function song(): BelongsTo
    {
        return $this->belongsTo(Song::class);
    }

    /**
     * Get the results for the session.
     */
    public function results(): HasMany
    {
        return $this->hasMany(PracticeResult::class);
    }

    /**
     * Check if the session is completed.
     */
    public function getIsCompletedAttribute(): bool
    {
        return $this->completed_at !== null;
    }

    /**
     * Get the duration of the session in seconds.
     */
    public function getDurationAttribute(): ?int
    {
        if (!$this->started_at || !$this->completed_at) {
            return null;
        }

        return $this->completed_at->diffInSeconds($this->started_at);
    }

    /**
     * Calculate and update accuracy.
     */
    public function calculateAccuracy(): void
    {
        if ($this->total_events === 0) {
            $this->accuracy = 0;
            return;
        }

        $successfulHits = $this->perfect_count + $this->good_count;
        $this->accuracy = round(($successfulHits / $this->total_events) * 100, 2);
    }

    /**
     * Scope a query to only include completed sessions.
     */
    public function scopeCompleted($query)
    {
        return $query->whereNotNull('completed_at');
    }

    /**
     * Scope a query to only include sessions for a specific user.
     */
    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }
}

// Made with Bob
