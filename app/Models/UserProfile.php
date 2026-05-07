<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'phone',
        'address',
        'points',
    ];

    /**
     * Quan hệ ngược lại với User
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
