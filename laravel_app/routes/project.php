<?php

use App\Http\Controllers\Project\ProjectCURDController;
use Illuminate\Support\Facades\Route;

Route::prefix('project')->name('project.')->group(function () {
    Route::get('/', [ProjectCURDController::class, 'index'])->name('index');
});
