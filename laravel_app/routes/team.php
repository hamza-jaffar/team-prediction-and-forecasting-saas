<?php

use App\Http\Controllers\Team\TeamCRUDController;
use App\Http\Controllers\Team\TeamDashboardController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('team/{team}/dashboard', [TeamDashboardController::class, 'dashboard'])->name('team.dashboard');

    Route::resource('team', TeamCRUDController::class);

});
