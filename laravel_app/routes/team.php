<?php

use App\Http\Controllers\Project\ProjectCURDController;
use App\Http\Controllers\Team\TeamController;
use App\Http\Controllers\Team\TeamCRUDController;
use App\Http\Controllers\Team\TeamDashboardController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('team/{team}/dashboard', [TeamDashboardController::class, 'dashboard'])->name('team.dashboard');

    Route::prefix('team/{team}')->name('team.')->group(function () {
        Route::get('members/search', [\App\Http\Controllers\Team\TeamMemberController::class, 'search'])->name('members.search');
        Route::resource('members', \App\Http\Controllers\Team\TeamMemberController::class);
        Route::resource('roles', \App\Http\Controllers\Team\TeamRoleController::class);

        // Team Projects
        Route::prefix('projects')->name('project.')->group(function () {
            Route::get('/', [ProjectCURDController::class, 'index'])->name('index');
            Route::get('/create', [ProjectCURDController::class, 'create'])->name('create');

            // Project Settings within Team Context
            Route::get('/{slug}/settings', [\App\Http\Controllers\Project\ProjectSettingController::class, 'index'])->name('settings');
        });

        // Team Tasks
        Route::prefix('tasks')->name('task.')->group(function () {
            Route::get('/', [\App\Http\Controllers\Task\TaskCURDController::class, 'index'])->name('index');
            Route::get('/create', [\App\Http\Controllers\Task\TaskCURDController::class, 'create'])->name('create');
            Route::post('/store', [\App\Http\Controllers\Task\TaskCURDController::class, 'store'])->name('store');
            Route::get('/{slug}', [\App\Http\Controllers\Task\TaskCURDController::class, 'show'])->name('show');
            Route::get('/edit/{slug}', [\App\Http\Controllers\Task\TaskCURDController::class, 'edit'])->name('edit');
            Route::put('/update/{slug}', [\App\Http\Controllers\Task\TaskCURDController::class, 'update'])->name('update');
            Route::delete('/destroy/{slug}', [\App\Http\Controllers\Task\TaskCURDController::class, 'destroy'])->name('destroy');
            Route::post('/restore/{slug}', [\App\Http\Controllers\Task\TaskCURDController::class, 'restore'])->name('restore');
            Route::delete('/force-delete/{slug}', [\App\Http\Controllers\Task\TaskCURDController::class, 'forceDelete'])->name('forceDelete');
        });
    });
    Route::resource('team', TeamCRUDController::class)->only(['index', 'create', 'store', 'show', 'edit', 'update', 'destroy']);
    Route::get('/my-teams', [TeamController::class, 'myTeams'])->name('my-teams');
});
