<?php

namespace App\Http\Controllers\Project;

use App\Http\Controllers\Controller;
use App\Http\Requests\Project\CreateEditProjectRequest;
use App\Service\ProjectService;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class ProjectCURDController extends Controller
{
    public function index(\Illuminate\Http\Request $request, \App\Models\Team $team = null)
    {
        $projects = ProjectService::getProjects($request, $team);

        if ($request->wantsJson()) {
            return response()->json($projects);
        }

        return Inertia::render('project/index', [
            'projects' => $projects,
            'queryParams' => $request->all(['search', 'sort_field', 'sort_direction', 'trashed', 'status', 'start_date', 'end_date']),
            'team' => $team,
        ]);
    }

    public function create(\App\Models\Team $team = null)
    {
        return Inertia::render('project/create', [
            'team' => $team,
        ]);
    }

    public function store(CreateEditProjectRequest $request, \App\Models\Team $team = null)
    {
        try {
            ProjectService::create($request->validated(), $team ? $team->id : null);

            if ($team) {
                return redirect()->route('team.project.index', $team->slug)->with('success', 'Project created successfully.');
            }

            return redirect()->route('project.index')->with('success', 'Project created successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to create project: '.$e->getMessage());

            return redirect()->back()->with('error', 'Failed to create project.');
        }
    }

    public function edit($team, $slug = null)
    {
        try {
            // Handle positional arguments: if $slug is null, $team is actually the $slug
            if ($slug === null) {
                $actualSlug = $team;
                $actualTeam = null;
            } else {
                $actualSlug = $slug;
                $actualTeam = $team instanceof \App\Models\Team ? $team : \App\Models\Team::where('slug', $team)->first();
            }

            $project = ProjectService::getProjectBySlug($actualSlug);

            return Inertia::render('project/edit', [
                'project' => $project,
                'team' => $actualTeam,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to get project: '.$e->getMessage());

            if (isset($actualTeam) && $actualTeam) {
                return redirect()->route('team.project.index', $actualTeam->slug)->with('error', 'Project not found.');
            }

            return redirect()->route('project.index')->with('error', 'Project not found.');
        }
    }

    public function update(\Illuminate\Http\Request $request, $team, $slug = null)
    {
        try {
            if ($slug === null) {
                $actualSlug = $team;
                $actualTeam = null;
            } else {
                $actualSlug = $slug;
                $actualTeam = $team instanceof \App\Models\Team ? $team : \App\Models\Team::where('slug', $team)->first();
            }

            // CreateEditProjectRequest logic moved here or validated manually if shared
            $data = $request->validate([
                'name' => 'required',
                'description' => 'nullable',
                'start_date' => 'required|date',
                'end_date' => 'required|date|after_or_equal:start_date',
            ]);

            ProjectService::update($actualSlug, $data);

            if ($actualTeam) {
                return redirect()->route('team.project.index', $actualTeam->slug)->with('success', 'Project updated successfully.');
            }

            return redirect()->route('project.index')->with('success', 'Project updated successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to update project: '.$e->getMessage());

            return redirect()->back()->with('error', 'Failed to update project.');
        }
    }

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

            ProjectService::delete($actualSlug);

            if ($actualTeam) {
                return redirect()->route('team.project.index', $actualTeam->slug)->with('success', 'Project moved to trash.');
            }

            return redirect()->route('project.index')->with('success', 'Project moved to trash.');
        } catch (\Exception $e) {
            Log::error('Failed to delete project: '.$e->getMessage());

            return redirect()->back()->with('error', 'Failed to delete project.');
        }
    }

    public function updateStatus(\Illuminate\Http\Request $request, $team, $slug = null)
    {
        try {
            if ($slug === null) {
                $actualSlug = $team;
            } else {
                $actualSlug = $slug;
            }

            $request->validate([
                'status' => 'required|in:active,completed,archived',
            ]);

            ProjectService::updateStatus($actualSlug, $request->status);

            return back()->with('success', 'Project status updated successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to update status: '.$e->getMessage());

            return back()->with('error', 'Failed to update status.');
        }
    }

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

            ProjectService::restore($actualSlug);

            if ($actualTeam) {
                return redirect()->route('team.project.index', $actualTeam->slug)->with('success', 'Project restored successfully.');
            }

            return redirect()->route('project.index')->with('success', 'Project restored successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to restore project: '.$e->getMessage());

            return redirect()->back()->with('error', 'Failed to restore project.');
        }
    }

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

            ProjectService::forceDelete($actualSlug);

            if ($actualTeam) {
                return redirect()->route('team.project.index', $actualTeam->slug)->with('success', 'Project permanently deleted.');
            }

            return redirect()->route('project.index')->with('success', 'Project permanently deleted.');
        } catch (\Exception $e) {
            Log::error('Failed to permanently delete project: '.$e->getMessage());

            return redirect()->back()->with('error', 'Failed to permanently delete project.');
        }
    }
}
