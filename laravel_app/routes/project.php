<?php

use App\Http\Controllers\Project\ProjectCURDController;
use App\Http\Controllers\Project\ProjectSettingController;
use Illuminate\Support\Facades\Route;

Route::prefix('project')->middleware('auth')->name('project.')->group(function () {
    Route::get('/', [ProjectCURDController::class, 'index'])->name('index');
    Route::get('/create', [ProjectCURDController::class, 'create'])->name('create');
    Route::post('/store', [ProjectCURDController::class, 'store'])->name('store');
    Route::get('/edit/{slug}', [ProjectCURDController::class, 'edit'])->name('edit');
    Route::put('/update/{slug}', [ProjectCURDController::class, 'update'])->name('update');
    Route::delete('/destroy/{slug}', [ProjectCURDController::class, 'destroy'])->name('destroy');
    Route::patch('/restore/{slug}', [ProjectCURDController::class, 'restore'])->name('restore');
    Route::delete('/force-delete/{slug}', [ProjectCURDController::class, 'forceDelete'])->name('force_delete');
    Route::patch('/update-status/{slug}', [ProjectCURDController::class, 'updateStatus'])->name('update_status');
    Route::get('/{slug}/settings', [ProjectSettingController::class, 'index'])->name('settings');
    Route::post('/{project_id}/add-team', [ProjectSettingController::class, 'addTeam'])->name('add_team');
    Route::delete('/{project_id}/remove-team/{team_id}', [ProjectSettingController::class, 'removeTeam'])->name('remove_team');
    Route::patch('/{project_id}/restore-team/{team_id}', [ProjectSettingController::class, 'restoreTeam'])->name('restore_team');
    Route::delete('/{project_id}/force-delete-team/{team_id}', [ProjectSettingController::class, 'forceDeleteTeam'])->name('force_delete_team');
});
