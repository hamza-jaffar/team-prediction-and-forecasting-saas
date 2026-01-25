<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Jenssegers\Agent\Agent;

class SessionController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('settings/sessions');
    }

    public function getSessions(Request $request)
    {
        $sessions = $request->user()->sessions()
            ->orderBy('last_activity', 'desc')
            ->get();

        $currentSessionId = $request->session()->getId();

        $formattedSessions = $sessions->map(function ($session) use ($currentSessionId) {
            $agent = new Agent;
            $agent->setUserAgent($session->user_agent);

            return [
                'id' => $session->id,
                'ip_address' => $session->ip_address,
                'is_current_device' => $session->id === $currentSessionId,
                'browser' => $agent->browser(),
                'platform' => $agent->platform(),
                'device' => $agent->device(),
                'is_mobile' => $agent->isMobile(),
                'is_desktop' => $agent->isDesktop(),
                'last_active' => Carbon::createFromTimestamp($session->last_activity)->diffForHumans(),
            ];
        });

        return response()->json($formattedSessions);
    }

    public function destroy(Request $request, $id)
    {
        $request->user()->sessions()->where('id', $id)->delete();

        return back();
    }

    public function getLoginHistory(Request $request)
    {
        $history = $request->user()->loginActivities()
            ->orderBy('login_at', 'desc')
            ->take(50)
            ->get();

        $formattedHistory = $history->map(function ($activity) {
            $agent = new Agent;
            $agent->setUserAgent($activity->user_agent);

            return [
                'id' => $activity->id,
                'ip_address' => $activity->ip_address,
                'browser' => $agent->browser(),
                'platform' => $agent->platform(),
                'device' => $agent->device(),
                'is_mobile' => $agent->isMobile(),
                'is_desktop' => $agent->isDesktop(),
                'login_at' => $activity->login_at->diffForHumans(),
            ];
        });

        return response()->json($formattedHistory);
    }
}
