<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    //SPESIFIK TABLE NAME
    protected $table = 'loan_payments';

    // CASTING KOLOM KE TIPE DATA TERTENTU
    protected $casts = [
        'approved_at' => 'datetime',
    ];

    //MASS ASSIGMENT
    protected $fillable = [
        'loan_id',
        'amount',
        'status',
        'approved_by',
    ];

    //RELASI TABEL
    //1. relasi ke tabel loan
    public function loan()
    {
        return $this->belongsTo(Loan::class, 'loan_id');
    }

    //relasi ke tabel user 
    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
