<?php

namespace App\Service;

use App\Models\Team;
use Illuminate\Support\Facades\Auth;

class TeamService
{
    public static function getMyTeams()
    {
        try {
            return Auth::user()->teams;
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }
    }

    public static function getTeamById($id)
    {
        try {
            return Team::where('id', $id)->firstOrFail();
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }
    }

    public static function getTeamBySlug($slug)
    {
        try {
            dd(Team::where('slug', $slug)->first());

            return Team::where('slug', $slug)->first();
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }
    }
}
