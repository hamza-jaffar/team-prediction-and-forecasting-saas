<?php

namespace App\Http\Controllers\Team;

use App\Helpers\SlugHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Team\CreateEditRequest;
use App\Models\Team;
use App\Models\TeamRole;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeamCRUDController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $teams = Team::all();

        return response()->json([
            'teams' => $teams,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('team/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateEditRequest $request)
    {
        try {
            $team = Team::create([
                ...$request->validated(),
                'user_id' => auth()->id(),
                'slug' => SlugHelper::create($request->name, 'teams'),
            ]);


            $ownerRole = TeamRole::where('slug', 'owner')->first();
            $team->users()->attach(auth()->id(), ['team_role_id' => $ownerRole?->id]);

            $user = auth()->user();
            $user->current_team_id = $team->id;
            $user->save();

            return redirect()->route('dashboard')->with('success', 'Team created successfully');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to create team');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
