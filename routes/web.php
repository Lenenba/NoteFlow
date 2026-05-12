<?php

use App\Http\Controllers\SongController;
use App\Http\Controllers\PracticeSessionController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // Song routes
    Route::resource('songs', SongController::class);
    Route::get('songs/{song}/practice', [SongController::class, 'practice'])->name('songs.practice');

    // Practice session routes
    Route::resource('practice-sessions', PracticeSessionController::class);
    Route::get('practice-sessions/statistics', [PracticeSessionController::class, 'statistics'])->name('practice-sessions.statistics');

    // Music Game (Yousician-style) - NEW!
    Route::inertia('music-practice/demo', 'MusicPractice/Show')->name('music-practice.demo');
});

require __DIR__.'/settings.php';
