<?php

namespace App\Http\Controllers\Team;

use App\Http\Controllers\Controller;
use App\Service\TeamService;
use Illuminate\Support\Facades\Log;

class TeamController extends Controller
{
    public function myTeams()
    {
        try {
            $teams = TeamService::getMyTeams();

            return response()->json([
                'teams' => $teams,
            ], 200);
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return response()->json([
                'message' => 'Failed to fetch teams',
            ], 500);
        }
    }
}
