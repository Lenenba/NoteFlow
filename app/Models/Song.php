<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Song extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'bpm',
        'duration',
        'key',
        'difficulty',
        'is_public',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'bpm' => 'integer',
        'duration' => 'decimal:2',
        'is_public' => 'boolean',
    ];

    /**
     * Get the user that owns the song.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the events for the song.
     */
    public function events(): HasMany
    {
        return $this->hasMany(SongEvent::class)->orderBy('start_time');
    }

    /**
     * Get the practice sessions for the song.
     */
    public function practiceSessions(): HasMany
    {
        return $this->hasMany(PracticeSession::class);
    }

    /**
     * Get the total number of events in the song.
     */
    public function getTotalEventsAttribute(): int
    {
        return $this->events()->count();
    }

    /**
     * Scope a query to only include public songs.
     */
    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }

    /**
     * Scope a query to filter by difficulty.
     */
    public function scopeDifficulty($query, string $difficulty)
    {
        return $query->where('difficulty', $difficulty);
    }
}

// Made with Bob
