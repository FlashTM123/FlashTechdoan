<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;

class User extends Authenticatable implements FilamentUser
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    public function canAccessPanel(Panel $panel): bool
    {
        return $this->is_active === true;
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'employee_code',
        'department',
        'role',
        'is_active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Kiểm tra xem user có phải Admin không
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin' && $this->is_active;
    }

    /**
     * Kiểm tra xem user có phải Moderator không
     */
    public function isModerator(): bool
    {
        return $this->role === 'moderator' && $this->is_active;
    }

    /**
     * Kiểm tra xem user có phải Employee không
     */
    public function isEmployee(): bool
    {
        return $this->role === 'employee' && $this->is_active;
    }

    /**
     * Kiểm tra xem user có là Staff (Admin hoặc Moderator) không
     */
    public function isStaff(): bool
    {
        return in_array($this->role, ['admin', 'moderator']) && $this->is_active;
    }

    /**
     * Kiểm tra xem user có active không
     */
    public function isActive(): bool
    {
        return $this->is_active === true;
    }
}
