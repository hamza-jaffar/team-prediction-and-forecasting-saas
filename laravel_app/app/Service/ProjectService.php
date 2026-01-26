<?php

namespace App\Service;

use App\Helpers\SlugHelper;
use App\Models\Project;
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

    public static function getProjects($request)
    {
        try {
            $query = Project::with(['owner'])->where('created_by', Auth::id())->whereNull('deleted_at');

            if ($request->has('search')) {
                $query->where('name', 'like', '%'.$request->search.'%');
            }

            if ($request->has('sort_field') && $request->has('sort_direction')) {
                $query->orderBy($request->sort_field, $request->sort_direction);
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
        return Project::with(['owner'])->where('slug', $slug)->firstOrFail();
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
}
