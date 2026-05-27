<?php

namespace App\Models;
use App\Models\User;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $fillable = [
        'name',
        'code',
        'description',
    ];

    public function employees()
    {
        return $this->hasMany(User::class);
    }
}
