<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeamPermission extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
    ];

    public function roles()
    {
        return $this->belongsToMany(TeamRole::class, 'team_permission_role');
    }
}
