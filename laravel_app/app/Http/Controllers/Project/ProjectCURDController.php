<?php

namespace App\Http\Controllers\Project;

use App\Http\Controllers\Controller;
use App\Http\Requests\Project\CreateEditProjectRequest;
use App\Service\ProjectService;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class ProjectCURDController extends Controller
{
    public function index(\Illuminate\Http\Request $request)
    {
        $projects = ProjectService::getProjects($request);

        return Inertia::render('project/index', [
            'projects' => $projects,
            'queryParams' => $request->query() ?: null,
        ]);
    }

    public function create()
    {
        return Inertia::render('project/create');
    }

    public function store(CreateEditProjectRequest $request)
    {
        try {
            ProjectService::create($request->validated());

            return redirect()->route('project.index')->with('success', 'Project created successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to create project: '.$e->getMessage());

            return redirect()->back()->with('error', 'Failed to create project.');
        }
    }

    public function edit($slug)
    {
        try {
            $project = ProjectService::getProjectBySlug($slug);

            return Inertia::render('project/edit', [
                'project' => $project,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to get project: '.$e->getMessage());

            return redirect()->route('project.index')->with('error', 'Project not found.');
        }
    }

    public function update($slug, CreateEditProjectRequest $request)
    {
        try {
            ProjectService::update($slug, $request->validated());

            return redirect()->route('project.index')->with('success', 'Project updated successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to update project: '.$e->getMessage());

            return redirect()->back()->with('error', 'Failed to update project.');
        }
    }

    public function destroy($slug)
    {
        try {
            ProjectService::delete($slug);

            return redirect()->route('project.index')->with('success', 'Project moved to trash.');
        } catch (\Exception $e) {
            Log::error('Failed to delete project: '.$e->getMessage());

            return redirect()->back()->with('error', 'Failed to delete project.');
        }
    }

    public function updateStatus($slug, \Illuminate\Http\Request $request)
    {
        try {
            $request->validate([
                'status' => 'required|in:active,completed,archived',
            ]);

            ProjectService::updateStatus($slug, $request->status);

            return back()->with('success', 'Project status updated successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to update status: '.$e->getMessage());

            return back()->with('error', 'Failed to update status.');
        }
    }

    public function restore($slug)
    {
        try {
            ProjectService::restore($slug);

            return redirect()->route('project.index')->with('success', 'Project restored successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to restore project: '.$e->getMessage());

            return redirect()->back()->with('error', 'Failed to restore project.');
        }
    }

    public function forceDelete($slug)
    {
        try {
            ProjectService::forceDelete($slug);

            return redirect()->route('project.index')->with('success', 'Project permanently deleted.');
        } catch (\Exception $e) {
            Log::error('Failed to permanently delete project: '.$e->getMessage());

            return redirect()->back()->with('error', 'Failed to permanently delete project.');
        }
    }
}
