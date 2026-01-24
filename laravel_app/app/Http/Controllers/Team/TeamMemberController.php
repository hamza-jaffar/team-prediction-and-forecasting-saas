<?php

namespace App\Http\Controllers\Team;

use App\Http\Controllers\Controller;
use App\Models\Team;
use App\Models\User;
use App\Models\TeamRole;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeamMemberController extends Controller
{
    public function search(Request $request, Team $team)
    {
        $query = $request->query('query');

        if (!$query) {
            return response()->json([]);
        }

        $users = User::where(function ($q) use ($query) {
            $q->where('email', 'like', "%{$query}%")
              ->orWhere('first_name', 'like', "%{$query}%")
              ->orWhere('last_name', 'like', "%{$query}%");
        })
        ->limit(10)
        ->get()
        ->map(function ($user) use ($team) {
            return [
                'id' => $user->id,
                'email' => $user->email,
                'name' => "{$user->first_name} {$user->last_name}",
                'is_current_user' => $user->id === auth()->id(),
                'is_already_member' => $team->users()->where('user_id', $user->id)->exists(),
            ];
        });

        return response()->json($users);
    }

    public function index(Team $team)
    {
        $this->authorize('manageMembers', $team);

        $members = $team->users()->withPivot('team_role_id')->get()->map(function ($user) {
            $user->team_role = TeamRole::find($user->pivot->team_role_id);
            return $user;
        });

        return Inertia::render('team/members/index', [
            'team' => $team,
            'members' => $members,
            'roles' => TeamRole::whereNull('team_id')->orWhere('team_id', $team->id)->get(),
        ]);
    }

    public function store(Request $request, Team $team)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'team_role_id' => 'required|exists:team_roles,id',
        ]);

        $user = User::where('email', $request->email)->first();

        if ($team->users()->where('user_id', $user->id)->exists()) {
            return back()->with('error', 'User is already a member of this team');
        }

        $team->users()->attach($user->id, ['team_role_id' => $request->team_role_id]);

        return back()->with('success', 'Member added successfully');
    }

    public function update(Request $request, Team $team, User $member)
    {
        $request->validate([
            'team_role_id' => 'required|exists:team_roles,id',
        ]);

        // Don't allow changing owner's role through this? 
        // Or handle it in policy if needed.
        
        $team->users()->updateExistingPivot($member->id, ['team_role_id' => $request->team_role_id]);

        return back()->with('success', 'Member role updated');
    }

    public function destroy(Team $team, User $member)
    {
        if ($member->id === $team->user_id) {
            return back()->with('error', 'The owner cannot be removed');
        }

        $team->users()->detach($member->id);

        return back()->with('success', 'Member removed');
    }
}
