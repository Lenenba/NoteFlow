<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SongEvent extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'song_id',
        'chord',
        'start_time',
        'duration',
        'track',
        'notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'start_time' => 'decimal:3',
        'duration' => 'decimal:3',
        'track' => 'integer',
        'notes' => 'array',
    ];

    /**
     * Get the song that owns the event.
     */
    public function song(): BelongsTo
    {
        return $this->belongsTo(Song::class);
    }

    /**
     * Get the practice results for the event.
     */
    public function practiceResults(): HasMany
    {
        return $this->hasMany(PracticeResult::class);
    }

    /**
     * Get the end time of the event.
     */
    public function getEndTimeAttribute(): float
    {
        return (float) $this->start_time + (float) $this->duration;
    }

    /**
     * Scope a query to get events within a time range.
     */
    public function scopeInTimeRange($query, float $startTime, float $endTime)
    {
        return $query->where('start_time', '>=', $startTime)
                     ->where('start_time', '<=', $endTime);
    }
}

// Made with Bob
