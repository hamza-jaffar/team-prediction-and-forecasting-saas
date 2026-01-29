<?php

namespace App\Http\Controllers\Team;

use App\Http\Controllers\Controller;
use App\Models\Team;
use Inertia\Inertia;

class TeamDashboardController extends Controller
{
    public function dashboard(Team $team)
    {
        $stats = [
            'members_count' => $team->users()->count(),
            'tasks_count' => $team->tasks()->count(),
            'completed_tasks_count' => $team->tasks()->where('status', 'done')->count(),
            'in_progress_tasks_count' => $team->tasks()->where('status', 'in_progress')->count(),
            'overdue_tasks_count' => $team->tasks()
                ->where('status', '!=', 'done')
                ->where('due_date', '<', now())
                ->count(),
        ];

        $recentTasks = $team->tasks()
            ->with(['assignedUsers', 'creator'])
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('team/dashboard/index', [
            'team' => $team,
            'stats' => $stats,
            'recentTasks' => $recentTasks,
        ]);
    }
}
