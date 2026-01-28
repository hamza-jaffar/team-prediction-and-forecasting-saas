<?php

namespace App\Helpers;

use App\Models\Team;
use App\Models\TeamRole;
use App\Models\User;

class UtilHelper
{
    public static function roleInTeam(Team $team, User $user): ?TeamRole
    {
        $userWithPivot = $team->users()
            ->where('users.id', $user->id)
            ->first();

        if (!$userWithPivot || !$userWithPivot->pivot->team_role_id) {
            return null;
        }

        return TeamRole::find($userWithPivot->pivot->team_role_id);
    }
}
