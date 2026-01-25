<?php

use App\Http\Controllers\Task\TaskCURDController;
use Illuminate\Support\Facades\Route;

Route::prefix('task')->name('task.')->group(function () {
    Route::get('/', [TaskCURDController::class, 'index'])->name('index');
});
