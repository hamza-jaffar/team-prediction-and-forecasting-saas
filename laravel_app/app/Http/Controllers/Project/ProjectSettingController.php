<?php

namespace App\Http\Controllers\Project;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use App\Service\ProjectService;
use log;

class ProjectSettingController extends Controller
{
    public function index(string $slug)
    {
        try {

            $project = ProjectService::getProjectBySlug($slug);
            return Inertia::render('project/settings/index', [
                'project' => $project
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to get project: '.$e->getMessage());

            return redirect()->route('project.index')->with('error', 'Project not found.');
        }

    }
}
