<?php

namespace App\Http\Controllers\Project;

use App\Http\Controllers\Controller;
use App\Http\Requests\Project\AddTeamRequest;
use App\Service\ProjectService;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ProjectSettingController extends Controller
{
    public function index(string $slug)
    {
        $project = ProjectService::getProjectBySlug($slug);
        try {

            return Inertia::render('project/settings/index', [
                'project' => $project,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to get project: '.$e->getMessage());

            return redirect()->route('project.index')->with('error', 'Project not found.');
        }
    }

    public function addTeam(AddTeamRequest $request, string $projectId)
    {
        try {

            $project = ProjectService::getProjectById($projectId);

            ProjectService::addTeam($request, $project->id);

            return redirect()->route('project.settings', $project->slug)->with('success', 'Team added successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to add team: '.$e->getMessage());

            return redirect()->back()->with('error', 'Failed to add team.');
        }
    }

    public function removeTeam(string $projectId, string $teamId)
    {
        try {
            $project = ProjectService::getProjectById($projectId);

            ProjectService::removeTeam($projectId, $teamId);

            return redirect()->route('project.settings', $project->slug)->with('success', 'Team moved to trash.');
        } catch (\Exception $e) {
            Log::error('Failed to remove team: '.$e->getMessage());

            return redirect()->back()->with('error', 'Failed to remove team.');
        }
    }

    public function restoreTeam(string $projectId, string $teamId)
    {
        try {
            $project = ProjectService::getProjectById($projectId);

            ProjectService::restoreTeam($projectId, $teamId);

            return redirect()->route('project.settings', $project->slug)->with('success', 'Team restored successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to restore team: '.$e->getMessage());

            return redirect()->back()->with('error', 'Failed to restore team.');
        }
    }

    public function forceDeleteTeam(string $projectId, string $teamId)
    {
        try {
            $project = ProjectService::getProjectById($projectId);

            ProjectService::forceDeleteTeam($projectId, $teamId);

            return redirect()->route('project.settings', $project->slug)->with('success', 'Team permanently deleted.');
        } catch (\Exception $e) {
            Log::error('Failed to permanently delete team: '.$e->getMessage());

            return redirect()->back()->with('error', 'Failed to permanently delete team.');
        }
    }
}
