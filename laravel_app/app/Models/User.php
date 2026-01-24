<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'username',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    /**
     * Get the teams that the user owns.
     */
    public function ownedTeams()
    {
        return $this->hasMany(Team::class);
    }

    /**
     * Get all teams the user belongs to.
     */
    public function teams()
    {
        return $this->belongsToMany(Team::class)->withPivot('team_role_id')->withTimestamps();
    }

    /**
     * Get the current team that the user is switched to.
     */
    public function currentTeam()
    {
        return $this->belongsTo(Team::class, 'current_team_id');
    }

    /**
     * Determine if the user has a given permission within a team.
     */
    public function hasTeamPermission(Team $team, string $permission): bool
    {
        // Owners have all permissions
        if ($this->id === $team->user_id) {
            return true;
        }

        $membership = $team->users()->where('user_id', $this->id)->first();

        if (! $membership || ! isset($membership->pivot->team_role_id)) {
            return false;
        }

        $role = TeamRole::find($membership->pivot->team_role_id);

        if (! $role) {
            return false;
        }

        return $role->permissions()->where('slug', $permission)->exists();
    }
}
