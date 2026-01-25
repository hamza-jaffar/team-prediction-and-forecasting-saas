<?php

namespace App\Http\Controllers\Project;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

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

    public function store(Request $request)
    {
        dd($request->all());
    }
}
