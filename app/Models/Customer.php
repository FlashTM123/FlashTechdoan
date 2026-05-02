<?php

namespace App\Models;

use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Customer extends Authenticatable implements MustVerifyEmail, FilamentUser
{
    use HasFactory, Notifiable;

    /**
     * Bảng dữ liệu
     */
    protected $table = 'customers';

    /**
     * Các trường có thể gán giá trị
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'gender',
        'birthday',
        'points',
        'is_active',
    ];

    /**
     * Các trường cần ẩn khi serialize (không hiển thị ra JSON)
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Casting - chuyển đổi kiểu dữ liệu
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'birthday' => 'date',
            'points' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Filament: Khách hàng KHÔNG thể truy cập admin panel
     */
    public function canAccessPanel(Panel $panel): bool
    {
        return false;
    }

    /**
     * Kiểm tra khách hàng có active không
     */
    public function isActive(): bool
    {
        return $this->is_active === true;
    }

    /**
     * Tính tuổi từ birthday
     */
    public function getAgeAttribute(): ?int
    {
        if (!$this->birthday) return null;
        return $this->birthday->age;
    }

    /**
     * Tạo khách hàng mới với điểm khuyến mãi ban đầu
     */
    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($customer) {
            if (!$customer->points) {
                $customer->points = 0; // Mặc định 0 điểm
            }
        });
    }
    public function isValid(): bool
    {
        return !empty($this->name) && strlen($this->name) >= 3;
    }
}
