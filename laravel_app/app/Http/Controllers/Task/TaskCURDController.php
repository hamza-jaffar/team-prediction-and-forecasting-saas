<?php

namespace App\Http\Controllers\Task;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class TaskCURDController extends Controller
{
    public function index(\Illuminate\Http\Request $request, \App\Models\Team $team = null)
    {
        return Inertia::render('task/index', [
            'team' => $team,
        ]);
    }

    public function create(\Illuminate\Http\Request $request, \App\Models\Team $team = null)
    {
        return Inertia::render('task/create', [
            'team' => $team,
        ]);
    }

    public function store(\Illuminate\Http\Request $request, \App\Models\Team $team = null)
    {
        // Implementation logic for storing task
        
        if ($team) {
            return redirect()->route('team.task.index', $team->slug)->with('success', 'Task created successfully.');
        }

        return redirect()->route('task.index')->with('success', 'Task created successfully.');
    }

    public function edit($team, $slug = null)
    {
        if ($slug === null) {
            $actualSlug = $team;
            $actualTeam = null;
        } else {
            $actualSlug = $slug;
            $actualTeam = $team instanceof \App\Models\Team ? $team : \App\Models\Team::where('slug', $team)->first();
        }

        return Inertia::render('task/edit', [
            'team' => $actualTeam,
            'task' => null, // Placeholder for task data
        ]);
    }

    public function update(\Illuminate\Http\Request $request, $team, $slug = null)
    {
        if ($slug === null) {
            $actualSlug = $team;
            $actualTeam = null;
        } else {
            $actualSlug = $slug;
            $actualTeam = $team instanceof \App\Models\Team ? $team : \App\Models\Team::where('slug', $team)->first();
        }

        // Implementation logic for updating task

        if ($actualTeam) {
            return redirect()->route('team.task.index', $actualTeam->slug)->with('success', 'Task updated successfully.');
        }

        return redirect()->route('task.index')->with('success', 'Task updated successfully.');
    }

    public function destroy($team, $slug = null)
    {
        if ($slug === null) {
            $actualSlug = $team;
            $actualTeam = null;
        } else {
            $actualSlug = $slug;
            $actualTeam = $team instanceof \App\Models\Team ? $team : \App\Models\Team::where('slug', $team)->first();
        }

        // Implementation logic for deleting task

        if ($actualTeam) {
            return redirect()->route('team.task.index', $actualTeam->slug)->with('success', 'Task deleted successfully.');
        }

        return redirect()->route('task.index')->with('success', 'Task deleted successfully.');
    }
}
