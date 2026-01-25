<?php

use App\Http\Controllers\Project\ProjectCURDController;
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
});

