<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PracticeResult extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'practice_session_id',
        'song_event_id',
        'expected_chord',
        'played_chord',
        'expected_time',
        'played_time',
        'timing_offset',
        'result',
        'points',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'expected_time' => 'decimal:3',
        'played_time' => 'decimal:3',
        'timing_offset' => 'decimal:3',
        'points' => 'integer',
    ];

    /**
     * Get the practice session that owns the result.
     */
    public function practiceSession(): BelongsTo
    {
        return $this->belongsTo(PracticeSession::class);
    }

    /**
     * Get the song event for the result.
     */
    public function songEvent(): BelongsTo
    {
        return $this->belongsTo(SongEvent::class);
    }

    /**
     * Check if the result is a success (perfect or good).
     */
    public function getIsSuccessAttribute(): bool
    {
        return in_array($this->result, ['perfect', 'good']);
    }

    /**
     * Check if the result is a miss.
     */
    public function getIsMissAttribute(): bool
    {
        return $this->result === 'miss';
    }

    /**
     * Get the absolute timing offset in milliseconds.
     */
    public function getAbsoluteTimingOffsetAttribute(): float
    {
        return abs((float) $this->timing_offset);
    }

    /**
     * Scope a query to only include successful results.
     */
    public function scopeSuccessful($query)
    {
        return $query->whereIn('result', ['perfect', 'good']);
    }

    /**
     * Scope a query to filter by result type.
     */
    public function scopeByResult($query, string $result)
    {
        return $query->where('result', $result);
    }
}

// Made with Bob
