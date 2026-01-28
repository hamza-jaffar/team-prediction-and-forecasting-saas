<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProjectTeams extends Model
{
    use SoftDeletes;

    protected $table = 'project_teams';

    protected $fillable = [
        'project_id',
        'team_id',
        'role',
        'status',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function team()
    {
        return $this->belongsTo(Team::class);
    }
}
