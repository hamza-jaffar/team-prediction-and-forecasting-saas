<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function toResponse($request)
    {
        $user = $request->user();

        if ($user && $user->current_team_id && $user->load('currentTeam')->currentTeam) {
            return redirect()->route('team.dashboard', ['team' => $user->currentTeam->slug]);
        }

        return redirect()->intended(config('fortify.home'));
    }
}
