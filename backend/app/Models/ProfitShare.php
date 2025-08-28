<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProfitShare extends Model
{
    //SPESIFIK NAME
    protected $table = 'profit_shares';

    //CASTION KOLOM KE TIPE TERTENTU
    protected $casts = [
        'amount' => 'decimal:2',
        'year' => 'integer',
    ];

    //MASS ASSIGMNET
    protected $fillable = [
        'user_id',
        'year',
        'amount',
    ];

    //RELASI TABEL
    //1. relasi ke tabel user
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
