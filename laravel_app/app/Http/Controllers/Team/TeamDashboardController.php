<?php

namespace App\Http\Controllers\Team;

use App\Http\Controllers\Controller;
use App\Models\Team;
use Inertia\Inertia;

class TeamDashboardController extends Controller
{
    public function dashboard(Team $team)
    {
        return Inertia::render('team/dashboard/index', [
            'team' => $team,
        ]);
    }
}
