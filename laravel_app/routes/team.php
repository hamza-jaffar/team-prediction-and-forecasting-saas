<?php

use App\Http\Controllers\Team\TeamCRUDController;
use App\Http\Controllers\Team\TeamDashboardController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('team/{team}/dashboard', [TeamDashboardController::class, 'dashboard'])->name('team.dashboard');

    Route::prefix('team/{team}')->name('team.')->group(function () {
        Route::get('members/search', [\App\Http\Controllers\Team\TeamMemberController::class, 'search'])->name('members.search');
        Route::resource('members', \App\Http\Controllers\Team\TeamMemberController::class);
        Route::resource('roles', \App\Http\Controllers\Team\TeamRoleController::class);
    });

    Route::resource('team', TeamCRUDController::class)->only(['index', 'create', 'store', 'show', 'edit', 'update', 'destroy']);
});
