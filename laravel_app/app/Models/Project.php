<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'start_date',
        'end_date',
        'status',
        'created_by',
    ];

    public function owner()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
