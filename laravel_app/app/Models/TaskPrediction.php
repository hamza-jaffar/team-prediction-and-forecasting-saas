<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaskPrediction extends Model
{
    protected $fillable = [
        'task_id',
        'predicted_minutes',
        'confidence',
        'risk_level',
        'meta',
    ];

    protected $casts = [
        'predicted_minutes' => 'integer',
        'confidence' => 'decimal:2',
        'meta' => 'array',
    ];

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }
}
