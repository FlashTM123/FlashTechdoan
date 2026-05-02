<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Coupon extends Model
{
    protected $fillable = [
        'code',
        'type',
        'value',
        'min_order_amount',
        'usage_limit',
        'used_count',
        'is_active',
        'expires_at',
    ];

    protected $casts = [
        'is_active'  => 'boolean',
        'expires_at' => 'datetime',
        'value'      => 'decimal:2',
    ];

    // ─── Relationships ───────────────────────────────────────────────

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    // ─── Business Logic ──────────────────────────────────────────────

    /**
     * Kiểm tra mã giảm giá có hợp lệ hay không.
     * Điều kiện: đang active, chưa hết hạn, chưa vượt giới hạn sử dụng.
     */
    public function isValid(): bool
    {
        if (!$this->is_active) {
            return false;
        }

        if ($this->expires_at && $this->expires_at->isPast()) {
            return false;
        }

        if ($this->usage_limit !== null && $this->used_count >= $this->usage_limit) {
            return false;
        }

        return true;
    }

    /**
     * Tính số tiền được giảm dựa trên tổng đơn hàng.
     *
     * @param  float $orderTotal  Tổng tiền trước giảm giá
     * @return float              Số tiền được giảm
     */
    public function calculateDiscount(float $orderTotal): float
    {
        if ($this->type === 'percent') {
            // Giảm theo % — tối đa không vượt quá tổng đơn
            return min(($this->value / 100) * $orderTotal, $orderTotal);
        }

        // Giảm số tiền cố định — không âm
        return min((float) $this->value, $orderTotal);
    }

    /**
     * Tăng số lần đã sử dụng sau khi áp dụng thành công.
     */
    public function incrementUsage(): void
    {
        $this->increment('used_count');
    }

    // ─── Scopes ──────────────────────────────────────────────────────

    /**
     * Scope: chỉ lấy các mã còn hoạt động và chưa hết hạn.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true)
                     ->where(fn ($q) =>
                         $q->whereNull('expires_at')
                           ->orWhere('expires_at', '>', now())
                     );
    }
}
