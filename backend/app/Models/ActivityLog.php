<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    // SPESIFIK NAME
    protected $table = 'activity_logs';

    // MASS ASSIGNMENT
    protected $fillable = [
        'user_id',
        'action',
        'reference_id',
        'reference_table',
    ];

    // RELASI KE TABEL USER
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
