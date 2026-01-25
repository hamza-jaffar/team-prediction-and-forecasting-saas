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
}
