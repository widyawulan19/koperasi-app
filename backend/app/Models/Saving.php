<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Saving extends Model
{
    //SPESIFIK TABEL NAME
    protected $table = 'savings';

    //MASS ASSIGMENT 
    protected $fillable = [
        'user_id',
        'type',
        'amount',
        'profit_share',
        'date',
    ];

    // REALSI TABLE 
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
