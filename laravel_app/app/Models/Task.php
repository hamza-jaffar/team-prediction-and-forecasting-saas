<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Task extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'project_id',
        'team_id',
        'created_by',
        'title',
        'slug',
        'description',
        'status',
        'priority',
        'start_date',
        'due_date',
        'estimated_minutes',
        'actual_minutes',
        'completed_at',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'due_date' => 'datetime',
        'completed_at' => 'datetime',
        'estimated_minutes' => 'integer',
        'actual_minutes' => 'integer',
    ];

    public function project()
    {
        // Assuming Project model exists, otherwise this might need adjustment later
        // return $this->belongsTo(Project::class);
        // For now user didn't request Project model check, so I'll leave commented or generic
        // But migration has project_id. I will assume Project model exists or will be created.
        // Let's check if Project model exists first? No, let's stick to what's requested.
        // I will implement safe relationships.
        return $this->belongsTo(Project::class);
    }

    public function team()
    {
        return $this->belongsTo(Team::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function assignees(): HasMany
    {
        return $this->hasMany(TaskAssignee::class);
    }

    /**
     * Get the users assigned to the task through the assignees table.
     */
    public function assignedUsers()
    {
        return $this->belongsToMany(User::class, 'task_assignees', 'task_id', 'user_id')
            ->withTimestamps();
    }

    public function comments(): HasMany
    {
        return $this->hasMany(TaskComment::class);
    }

    public function activities(): HasMany
    {
        return $this->hasMany(TaskActivity::class);
    }

    public function prediction(): HasOne
    {
        return $this->hasOne(TaskPrediction::class);
    }

    /**
     * Get the route key name for Laravel route model binding
     *
     * @return string
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
