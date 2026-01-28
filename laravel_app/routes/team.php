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
            Route::post('/store', [ProjectCURDController::class, 'store'])->name('store');
            Route::get('/edit/{slug}', [ProjectCURDController::class, 'edit'])->name('edit');
            Route::put('/update/{slug}', [ProjectCURDController::class, 'update'])->name('update');
            Route::delete('/destroy/{slug}', [ProjectCURDController::class, 'destroy'])->name('destroy');
            Route::patch('/restore/{slug}', [ProjectCURDController::class, 'restore'])->name('restore');
            Route::delete('/force-delete/{slug}', [ProjectCURDController::class, 'forceDelete'])->name('force_delete');
            Route::patch('/update-status/{slug}', [ProjectCURDController::class, 'updateStatus'])->name('update_status');

            // Project Settings within Team Context
            Route::get('/{slug}/settings', [\App\Http\Controllers\Project\ProjectSettingController::class, 'index'])->name('settings');
            Route::post('/{project_id}/add-team', [\App\Http\Controllers\Project\ProjectSettingController::class, 'addTeam'])->name('add_team');
            Route::delete('/{project_id}/remove-team/{team_id}', [\App\Http\Controllers\Project\ProjectSettingController::class, 'removeTeam'])->name('remove_team');
            Route::patch('/{project_id}/restore-team/{team_id}', [\App\Http\Controllers\Project\ProjectSettingController::class, 'restoreTeam'])->name('restore_team');
            Route::delete('/{project_id}/force-delete-team/{team_id}', [\App\Http\Controllers\Project\ProjectSettingController::class, 'forceDeleteTeam'])->name('force_delete_team');
        });

        // Team Tasks
        Route::prefix('tasks')->name('task.')->group(function () {
            Route::get('/', [\App\Http\Controllers\Task\TaskCURDController::class, 'index'])->name('index');
            Route::get('/create', [\App\Http\Controllers\Task\TaskCURDController::class, 'create'])->name('create');
            Route::post('/store', [\App\Http\Controllers\Task\TaskCURDController::class, 'store'])->name('store');
            Route::get('/edit/{slug}', [\App\Http\Controllers\Task\TaskCURDController::class, 'edit'])->name('edit');
            Route::put('/update/{slug}', [\App\Http\Controllers\Task\TaskCURDController::class, 'update'])->name('update');
            Route::delete('/destroy/{slug}', [\App\Http\Controllers\Task\TaskCURDController::class, 'destroy'])->name('destroy');
        });
    });
    Route::resource('team', TeamCRUDController::class)->only(['index', 'create', 'store', 'show', 'edit', 'update', 'destroy']);
    Route::get('/my-teams', [TeamController::class, 'myTeams'])->name('my-teams');
});
