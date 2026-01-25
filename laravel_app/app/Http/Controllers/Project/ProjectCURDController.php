<?php

namespace App\Http\Controllers\Project;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class ProjectCURDController extends Controller
{
    public function index()
    {
        return Inertia::render('project/index');
    }
}
