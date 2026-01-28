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

            return redirect()->route('project.settings', $project->slug)->with('success', 'Team removed successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to remove team: '.$e->getMessage());

            return redirect()->back()->with('error', 'Failed to remove team.');
        }
    }
}
