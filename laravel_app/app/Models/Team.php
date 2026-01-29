<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the users that belong to the team.
     */
    public function users()
    {
        return $this->belongsToMany(User::class)->withPivot('team_role_id')->withTimestamps();
    }

    /**
     * Get the roles for the team.
     */
    public function roles()
    {
        return $this->hasMany(TeamRole::class);
    }

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function projects()
    {
        return $this->hasMany(ProjectTeams::class, 'team_id', 'id')->with('project');
    }
}
