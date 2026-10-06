<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\JournalCalendarController;
use App\Http\Controllers\JournalEntryController;
use App\Http\Controllers\JournalImageController;
use App\Http\Controllers\JournalStatisticsController;
use App\Http\Controllers\JournalTagController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

/*
|--------------------------------------------------------------------------
| Protected Routes (Sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    // Auth & Profile
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);
    Route::put('/user/password', [AuthController::class, 'changePassword']);

    // Journal Entries CRUD & Shortcuts
    Route::get('/journals', [JournalEntryController::class, 'index']);
    Route::post('/journals', [JournalEntryController::class, 'store']);
    Route::get('/journals/{id}', [JournalEntryController::class, 'show']);
    Route::put('/journals/{id}', [JournalEntryController::class, 'update']);
    Route::delete('/journals/{id}', [JournalEntryController::class, 'destroy']);

    Route::post('/journals/{id}/favorite', [JournalEntryController::class, 'toggleFavorite']);
    Route::post('/journals/autosave', [JournalEntryController::class, 'autosave']);
    Route::post('/journals/{id}/autosave', [JournalEntryController::class, 'autosave']);

    Route::get('/favorites', [JournalEntryController::class, 'favorites']);
    Route::get('/drafts', [JournalEntryController::class, 'drafts']);

    // Image Upload & Delete
    Route::post('/journals/{id}/images', [JournalImageController::class, 'upload']);
    Route::delete('/journals/images/{id}', [JournalImageController::class, 'destroy']);

    // Tags
    Route::get('/tags', [JournalTagController::class, 'index']);
    Route::post('/tags', [JournalTagController::class, 'store']);
    Route::delete('/tags/{id}', [JournalTagController::class, 'destroy']);

    // Calendar
    Route::get('/calendar', [JournalCalendarController::class, 'index']);

    // Statistics & Streaks
    Route::get('/statistics', [JournalStatisticsController::class, 'index']);
});
