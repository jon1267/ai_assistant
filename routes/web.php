<?php

use App\Http\Controllers\BookController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::post('/ai/chat', [BookController::class, 'search'])->name('ai.chat');
});

require __DIR__.'/settings.php';
