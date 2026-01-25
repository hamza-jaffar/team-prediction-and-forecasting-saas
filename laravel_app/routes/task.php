<?php

use App\Http\Controllers\Task\TaskCURDController;
use Illuminate\Support\Facades\Route;

Route::prefix('task')->name('task.')->group(function () {
    Route::get('/', [TaskCURDController::class, 'index'])->name('index');
    Route::get('/create', [TaskCURDController::class, 'create'])->name('create');
    Route::post('/store', [TaskCURDController::class, 'store'])->name('store');
    Route::get('/edit/{slug}', [TaskCURDController::class, 'edit'])->name('edit');
    Route::put('/update/{slug}', [TaskCURDController::class, 'update'])->name('update');
    Route::delete('/destroy/{slug}', [TaskCURDController::class, 'destroy'])->name('destroy');
});
