<?php

namespace App\Service;

use App\Helpers\SlugHelper;
use App\Models\Project;
use App\Models\ProjectTeams;
use Illuminate\Support\Facades\Auth;

class ProjectService
{
    public static function create(array $data)
    {
        try {
            $data['created_by'] = Auth::id();
            $data['slug'] = SlugHelper::create($data['name'], 'projects');

            return Project::create($data);
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }
    }

    public static function getProjects($request, ?\App\Models\Team $team = null)
    {
        try {
            $query = Project::with(['owner']);

            if ($team && $team->exists) {
                $query->whereHas('teams', function ($q) use ($team) {
                    $q->where('team_id', $team->id);
                });
            } else {
                $query->where('created_by', Auth::id());
            }

            // Handle Trash
            if ($request->has('trashed') && $request->trashed === 'only') {
                $query->onlyTrashed();
            }

            // Status Filter
            if ($request->filled('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }

            // Date Filters
            if ($request->filled('start_date')) {
                $query->where('start_date', '>=', $request->start_date);
            }

            if ($request->filled('end_date')) {
                $query->where('end_date', '<=', $request->end_date);
            }

            // Search
            if ($request->filled('search')) {
                $query->where('name', 'like', '%'.$request->search.'%');
            }

            // Sorting
            if ($request->filled('sort_field')) {
                $direction = strtolower($request->sort_direction) === 'asc' ? 'asc' : 'desc';
                $query->orderBy($request->sort_field, $direction);
            } else {
                $query->orderBy('created_at', 'desc');
            }

            return $query->paginate($request->per_page ?? 10);
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }
    }

    public static function getProjectBySlug($slug)
    {
        return Project::withTrashed()->with(['owner', 'teams' => function ($query) {
            $query->withTrashed();
        }, 'teams.team.users', 'teams.team.roles'])->where('slug', $slug)->firstOrFail();
    }

    public static function getProjectById($id)
    {
        try {
            return Project::withTrashed()->with(['owner'])->where('id', $id)->firstOrFail();
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }
    }

    public static function update($slug, array $data)
    {
        try {
            $project = self::getProjectBySlug($slug);
            $project->update($data);

            return $project;
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }
    }

    public static function delete($slug)
    {
        try {
            $project = self::getProjectBySlug($slug);
            $project->delete();

            return $project;
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }
    }

    public static function restore($slug)
    {
        try {
            $project = Project::withTrashed()->where('slug', $slug)->firstOrFail();
            $project->restore();

            return $project;
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }
    }

    public static function forceDelete($slug)
    {
        try {
            $project = Project::withTrashed()->where('slug', $slug)->firstOrFail();
            $project->forceDelete();

            return true;
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }
    }

    public static function updateStatus($slug, $status)
    {
        try {
            $project = self::getProjectBySlug($slug);
            $project->update(['status' => $status]);

            return $project;
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }
    }

    public static function addTeam($request, $projectId): ProjectTeams
    {
        try {
            $project_team = ProjectTeams::create([
                'project_id' => $projectId,
                'team_id' => $request->team_id,
                'role' => $request->role,
                'status' => 'active',
            ]);

            return $project_team;
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }
    }

    public static function removeTeam($projectId, $teamId): bool
    {
        try {
            return ProjectTeams::where('project_id', $projectId)->where('team_id', $teamId)->delete();
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }
    }

    public static function restoreTeam($projectId, $teamId): bool
    {
        try {
            return ProjectTeams::onlyTrashed()->where('project_id', $projectId)->where('team_id', $teamId)->restore();
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }
    }

    public static function forceDeleteTeam($projectId, $teamId): bool
    {
        try {
            return ProjectTeams::onlyTrashed()->where('project_id', $projectId)->where('team_id', $teamId)->forceDelete();
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }
    }
}
