<?php

namespace App\Http\Controllers\Project;

use App\Http\Controllers\Controller;
use App\Http\Requests\Project\CreateEditProjectRequest;
use App\Service\ProjectService;
use Inertia\Inertia;
use Log;

class ProjectCURDController extends Controller
{
    public function index()
    {
        return Inertia::render('project/index');
    }

    public function create()
    {
        return Inertia::render('project/create');
    }

    public function store(CreateEditProjectRequest $request)
    {
        try {
            ProjectService::create($request->validated());

            return redirect()->route('project.index')->with('success', 'Project created successfully created.');
        } catch (\Exception $e) {
            Log::error('Failed to create project: '.$e->getMessage());

            return redirect()->back()->with('error', 'Failed to create project.');
        }
    }
}
