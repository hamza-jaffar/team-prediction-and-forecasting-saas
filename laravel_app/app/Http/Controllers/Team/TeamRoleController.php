<?php

namespace App\Http\Controllers\Team;

use App\Http\Controllers\Controller;
use App\Models\Team;
use App\Models\TeamRole;
use App\Models\TeamPermission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class TeamRoleController extends Controller
{
    public function index(Team $team)
    {
        $this->authorize('manageRoles', $team);

        return Inertia::render('team/roles/index', [
            'team' => $team,
            'roles' => TeamRole::where('team_id', $team->id)->with('permissions')->get(),
            'globalRoles' => TeamRole::whereNull('team_id')->with('permissions')->get(),
            'allPermissions' => TeamPermission::all(),
        ]);
    }

    public function store(Request $request, Team $team)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'permissions' => 'array',
            'permissions.*' => 'exists:team_permissions,id',
        ]);

        $role = TeamRole::create([
            'team_id' => $team->id,
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
        ]);

        if ($request->has('permissions')) {
            $role->permissions()->sync($request->permissions);
        }

        return back()->with('success', 'Role created successfully');
    }

    public function update(Request $request, Team $team, TeamRole $role)
    {
        // Don't allow editing global roles from here
        if ($role->team_id !== $team->id) {
             return back()->with('error', 'Cannot edit global roles');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'permissions' => 'array',
            'permissions.*' => 'exists:team_permissions,id',
        ]);

        $role->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
        ]);

        $role->permissions()->sync($request->permissions);

        return back()->with('success', 'Role updated successfully');
    }

    public function destroy(Team $team, TeamRole $role)
    {
         if ($role->team_id !== $team->id) {
             return back()->with('error', 'Cannot delete global roles');
        }

        $role->delete();

        return back()->with('success', 'Role deleted successfully');
    }
}
