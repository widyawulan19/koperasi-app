<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    //SET PASS
    public function setPasswordAttribute($password)
    {
        $this->attributes['password'] = bcrypt($password);
    }

    /**
     * Tipe data casting otomatis.
     */
    protected function casts(): array
    {
        return [
            'password' => 'hashed', // otomatis hashing kalau diisi
        ];
    }

    // RELASI TABEL 
    public function savings()
    {
        return $this->hasMany(Saving::class);
    }

    // TABEL LOANS 
    //1. LOANS USER
    public function loans()
    {
        return $this->hasMany(Loan::class, 'user_id');
    }

    //2. LOANS APPROVED
    public function approvedLoans()
    {
        return $this->hasMany(Loan::class, 'approved_by');
    }

    //END RELASI TABEL LOANS


    // RELATION TO LOAN PAYMENTS 
    public function approvedPayments()
    {
        return $this->hasMany(Payment::class, 'approved_by');
    }

    // END RELATION TO LOAN PAYMENTS 


    // PROFIT SHARE 
    public function profitShares()
    {
        return $this->hasMany(ProfitShare::class, 'user_id');
    }
    // END PROFIT SHARE 

    //RELASI KE TABEL ACTIVITY LOG
    public function activityLogs()
    {
        return $this->hasMany(ActivityLog::class, 'user_id');
    }

    //RELASI DENGAN TABEL USER DETAIL
    public function userDetails()
    {
        return $this->hasOne(DetailUser::class, 'user_id');
    }
}


// CATATAN 
// example 
//  public function savings()
//     {
//         return $this->hasMany(Saving::class);
//     }

// public function savings() -> "savings" adalah nama method 

// return $this->hasMany(Saving::class); -> "Saving" adalah nama file models 

// PARENTS 
// pakai - hasMany / hasOne 

// CHILD 
// pakai -> belongsTo 