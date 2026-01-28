<?php

namespace App\Http\Controllers\Project;

use App\Http\Controllers\Controller;
use App\Http\Requests\Project\AddTeamRequest;
use App\Service\ProjectService;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ProjectSettingController extends Controller
{
    public function index(\Illuminate\Http\Request $request, $team, $slug = null)
    {
        try {
            if ($slug === null) {
                $actualSlug = $team;
                $actualTeam = null;
            } else {
                $actualSlug = $slug;
                $actualTeam = $team instanceof \App\Models\Team ? $team : \App\Models\Team::where('slug', $team)->first();
            }

            $project = ProjectService::getProjectBySlug($actualSlug);

            return Inertia::render('project/settings/index', [
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

    public function addTeam(AddTeamRequest $request, $team, $projectId = null)
    {
        try {
            if ($projectId === null) {
                $actualProjectId = $team;
                $actualTeam = null;
            } else {
                $actualProjectId = $projectId;
                $actualTeam = $team instanceof \App\Models\Team ? $team : \App\Models\Team::where('slug', $team)->first();
            }

            $project = ProjectService::getProjectById($actualProjectId);
            ProjectService::addTeam($request, $project->id);

            if ($actualTeam) {
                return redirect()->route('team.project.settings', ['team' => $actualTeam->slug, 'slug' => $project->slug])->with('success', 'Team added successfully.');
            }

            return redirect()->route('project.settings', $project->slug)->with('success', 'Team added successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to add team: '.$e->getMessage());

            return redirect()->back()->with('error', 'Failed to add team.');
        }
    }

    public function removeTeam($team, $projectId, $teamId = null)
    {
        try {
            if ($teamId === null) {
                $actualTeamId = $projectId;
                $actualProjectId = $team;
                $actualTeam = null;
            } else {
                $actualTeamId = $teamId;
                $actualProjectId = $projectId;
                $actualTeam = $team instanceof \App\Models\Team ? $team : \App\Models\Team::where('slug', $team)->first();
            }

            $project = ProjectService::getProjectById($actualProjectId);
            ProjectService::removeTeam($actualProjectId, $actualTeamId);

            if ($actualTeam) {
                return redirect()->route('team.project.settings', ['team' => $actualTeam->slug, 'slug' => $project->slug])->with('success', 'Team moved to trash.');
            }

            return redirect()->route('project.settings', $project->slug)->with('success', 'Team moved to trash.');
        } catch (\Exception $e) {
            Log::error('Failed to remove team: '.$e->getMessage());

            return redirect()->back()->with('error', 'Failed to remove team.');
        }
    }

    public function restoreTeam($team, $projectId, $teamId = null)
    {
        try {
            if ($teamId === null) {
                $actualTeamId = $projectId;
                $actualProjectId = $team;
                $actualTeam = null;
            } else {
                $actualTeamId = $teamId;
                $actualProjectId = $projectId;
                $actualTeam = $team instanceof \App\Models\Team ? $team : \App\Models\Team::where('slug', $team)->first();
            }

            $project = ProjectService::getProjectById($actualProjectId);
            ProjectService::restoreTeam($actualProjectId, $actualTeamId);

            if ($actualTeam) {
                return redirect()->route('team.project.settings', ['team' => $actualTeam->slug, 'slug' => $project->slug])->with('success', 'Team restored successfully.');
            }

            return redirect()->route('project.settings', $project->slug)->with('success', 'Team restored successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to restore team: '.$e->getMessage());

            return redirect()->back()->with('error', 'Failed to restore team.');
        }
    }

    public function forceDeleteTeam($team, $projectId, $teamId = null)
    {
        try {
            if ($teamId === null) {
                $actualTeamId = $projectId;
                $actualProjectId = $team;
                $actualTeam = null;
            } else {
                $actualTeamId = $teamId;
                $actualProjectId = $projectId;
                $actualTeam = $team instanceof \App\Models\Team ? $team : \App\Models\Team::where('slug', $team)->first();
            }

            $project = ProjectService::getProjectById($actualProjectId);
            ProjectService::forceDeleteTeam($actualProjectId, $actualTeamId);

            if ($actualTeam) {
                return redirect()->route('team.project.settings', ['team' => $actualTeam->slug, 'slug' => $project->slug])->with('success', 'Team permanently deleted.');
            }

            return redirect()->route('project.settings', $project->slug)->with('success', 'Team permanently deleted.');
        } catch (\Exception $e) {
            Log::error('Failed to permanently delete team: '.$e->getMessage());

            return redirect()->back()->with('error', 'Failed to permanently delete team.');
        }
    }
}
