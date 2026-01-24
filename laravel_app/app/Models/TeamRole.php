<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeamRole extends Model
{
    protected $fillable = [
        'team_id',
        'name',
        'slug',
        'description',
    ];

    public function team()
    {
        return $this->belongsTo(Team::class);
    }

    public function permissions()
    {
        return $this->belongsToMany(TeamPermission::class, 'team_permission_role');
    }

    public function users()
    {
        return $this->hasMany(User::class, 'team_role_id');
    }
}
