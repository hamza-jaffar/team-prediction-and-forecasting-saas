<?php

namespace App\Http\Controllers\Task;

use App\Http\Controllers\Controller;
use App\Http\Requests\Task\CreateTaskRequest;
use App\Http\Requests\Task\UpdateTaskRequest;
use App\Service\ProjectService;
use App\Service\TaskService;
use Inertia\Inertia;

class TaskCURDController extends Controller
{
    /**
     * Display a listing of tasks
     */
    public function index(\Illuminate\Http\Request $request, ?\App\Models\Team $team = null)
    {
        try {
            $tasks = TaskService::getTasks($request, $team);

            if ($request->wantsJson() && ! $request->header('X-Inertia')) {
                return response()->json($tasks);
            }

            return Inertia::render('task/index', [
                'team' => $team,
                'tasks' => $tasks,
                'queryParams' => $request->query() ?: null,
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Show the form for creating a new task
     */
    public function create(\Illuminate\Http\Request $request, ?\App\Models\Team $team = null)
    {
        try {
            $projects = [];
            if ($team !== null) {
                $projects = ProjectService::getCurrentTeamProject($team);
            }

            if ($team === null) {
                $projects = ProjectService::getMyProjects();
            }

            return Inertia::render('task/create', [
                'team' => $team,
                'projects' => $projects,
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Store a newly created task in storage
     */
    public function store(CreateTaskRequest $request, ?\App\Models\Team $team = null)
    {
        try {
            $data = $request->validated();

            // Add team_id if team context exists
            if ($team) {
                $data['team_id'] = $team->id;
            }

            $task = TaskService::create($data);

            if ($team) {
                return redirect()->route('team.task.index', $team->slug)
                    ->with('success', 'Task created successfully.');
            }

            return redirect()->route('task.index')
                ->with('success', 'Task created successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', $e->getMessage());
        }
    }

    /**
     * Display the specified task
     */
    public function show($team, $slug = null)
    {
        try {
            // Handle both team and non-team routes
            if ($slug === null) {
                $actualSlug = $team;
                $actualTeam = null;
            } else {
                $actualSlug = $slug;
                $actualTeam = $team instanceof \App\Models\Team ? $team : \App\Models\Team::where('slug', $team)->first();
            }

            $task = TaskService::getTaskBySlug($actualSlug);

            return Inertia::render('task/show', [
                'team' => $actualTeam,
                'task' => $task,
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Show the form for editing the specified task
     */
    public function edit($team, $slug = null)
    {
        try {
            if ($slug === null) {
                $actualSlug = $team;
                $actualTeam = null;
            } else {
                $actualSlug = $slug;
                $actualTeam = $team instanceof \App\Models\Team ? $team : \App\Models\Team::where('slug', $team)->first();
            }

            $task = TaskService::getTaskBySlug($actualSlug);

            // Get projects for the dropdown
            $projects = $actualTeam
                ? ProjectService::getCurrentTeamProject($actualTeam)
                : ProjectService::getMyProjects();

            return Inertia::render('task/edit', [
                'team' => $actualTeam,
                'task' => $task,
                'projects' => $projects,
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Update the specified task in storage
     */
    public function update(UpdateTaskRequest $request, $team, $slug = null)
    {
        try {
            if ($slug === null) {
                $actualSlug = $team;
                $actualTeam = null;
            } else {
                $actualSlug = $slug;
                $actualTeam = $team instanceof \App\Models\Team ? $team : \App\Models\Team::where('slug', $team)->first();
            }

            $data = $request->validated();
            $task = TaskService::update($actualSlug, $data);

            if ($actualTeam) {
                return redirect()->route('team.task.index', $actualTeam->slug)
                    ->with('success', 'Task updated successfully.');
            }

            return redirect()->route('task.index')
                ->with('success', 'Task updated successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', $e->getMessage());
        }
    }

    /**
     * Soft delete the specified task
     */
    public function destroy($team, $slug = null)
    {
        try {
            if ($slug === null) {
                $actualSlug = $team;
                $actualTeam = null;
            } else {
                $actualSlug = $slug;
                $actualTeam = $team instanceof \App\Models\Team ? $team : \App\Models\Team::where('slug', $team)->first();
            }

            TaskService::delete($actualSlug);

            if ($actualTeam) {
                return redirect()->route('team.task.index', $actualTeam->slug)
                    ->with('success', 'Task moved to trash successfully.');
            }

            return redirect()->route('task.index')
                ->with('success', 'Task moved to trash successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Restore a soft-deleted task
     */
    public function restore($team, $slug = null)
    {
        try {
            if ($slug === null) {
                $actualSlug = $team;
                $actualTeam = null;
            } else {
                $actualSlug = $slug;
                $actualTeam = $team instanceof \App\Models\Team ? $team : \App\Models\Team::where('slug', $team)->first();
            }

            TaskService::restore($actualSlug);

            if ($actualTeam) {
                return redirect()->route('team.task.index', $actualTeam->slug)
                    ->with('success', 'Task restored successfully.');
            }

            return redirect()->route('task.index')
                ->with('success', 'Task restored successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Permanently delete the specified task
     */
    public function forceDelete($team, $slug = null)
    {
        try {
            if ($slug === null) {
                $actualSlug = $team;
                $actualTeam = null;
            } else {
                $actualSlug = $slug;
                $actualTeam = $team instanceof \App\Models\Team ? $team : \App\Models\Team::where('slug', $team)->first();
            }

            TaskService::forceDelete($actualSlug);

            if ($actualTeam) {
                return redirect()->route('team.task.index', $actualTeam->slug)
                    ->with('success', 'Task permanently deleted.');
            }

            return redirect()->route('task.index')
                ->with('success', 'Task permanently deleted.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
