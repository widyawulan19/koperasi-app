<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Loan extends Model
{

    //SPESIFIK TABEL NAME
    protected $table = 'loans';

    //MASS ASSSIGMENT
    protected $fillable = [
        'user_id',
        'amount',
        'status',
        'approved_by',
    ];


    //RELASI TABEL 

    //1. relasi ke user peminjam
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    //2. relasi ke user yang menyetujui
    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    //relasi tabel loan (parent) dan loan_payments (child)
    public function loanPayments()
    {
        return $this->hasMany(Payment::class, 'loan_id');
    }
}
