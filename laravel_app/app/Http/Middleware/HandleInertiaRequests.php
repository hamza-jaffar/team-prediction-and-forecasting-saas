<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user()?->load('teams');
        $activeTeam = $request->route('team');

        // Update current_team_id if we are on a team specific route
        if ($activeTeam instanceof \App\Models\Team && $user && $user->current_team_id !== $activeTeam->id) {
            $user->current_team_id = $activeTeam->id;
            $user->save();
        }

        // Clear current_team_id if we are on the personal dashboard route
        if ($request->routeIs('dashboard') && $user && $user->current_team_id !== null) {
            $user->current_team_id = null;
            $user->save();
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user,
                'active_team' => $activeTeam instanceof \App\Models\Team ? $activeTeam : null,
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
        ];
    }
}
