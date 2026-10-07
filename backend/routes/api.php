<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminJournalController;
use App\Http\Controllers\Admin\AdminSettingsController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\JournalCalendarController;
use App\Http\Controllers\JournalEntryController;
use App\Http\Controllers\JournalImageController;
use App\Http\Controllers\JournalStatisticsController;
use App\Http\Controllers\JournalTagController;
use App\Http\Controllers\PublicSettingsController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::get('/settings/public', [PublicSettingsController::class, 'index']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

/*
|--------------------------------------------------------------------------
| Protected User Routes (Sanctum)
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

    /*
    |--------------------------------------------------------------------------
    | Administrator Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('admin')->middleware('admin')->group(function () {
        // Stats & Overview
        Route::get('/stats', [AdminDashboardController::class, 'stats']);

        // User Management
        Route::get('/users', [AdminUserController::class, 'index']);
        Route::post('/users', [AdminUserController::class, 'store']);
        Route::put('/users/{id}', [AdminUserController::class, 'update']);
        Route::delete('/users/{id}', [AdminUserController::class, 'destroy']);

        // Journal Moderation
        Route::get('/journals', [AdminJournalController::class, 'index']);
        Route::get('/journals/{id}', [AdminJournalController::class, 'show']);
        Route::delete('/journals/{id}', [AdminJournalController::class, 'destroy']);

        // Brand & System Settings
        Route::get('/settings', [AdminSettingsController::class, 'index']);
        Route::put('/settings', [AdminSettingsController::class, 'update']);
        Route::post('/settings/logo', [AdminSettingsController::class, 'uploadLogo']);
        Route::delete('/settings/logo', [AdminSettingsController::class, 'removeLogo']);
    });
});
