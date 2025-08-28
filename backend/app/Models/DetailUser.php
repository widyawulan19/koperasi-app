<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetailUser extends Model
{
    //SPESIFIK TABLE NAME
    protected $table = 'user_details';

    //MASS ASSGN
    protected $fillable = ['user_id', 'phone', 'address'];

    //RELASI TABLE
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
