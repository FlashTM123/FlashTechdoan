<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'order_code',
        'total_amount',
        'shipping_address',
        'payment_method_id', // Thay đổi từ payment_method (string) sang ID
        'payment_status',
        'order_status',
        'notes',
        'coupon_id',
        'discount_amount',
        'processed_by_id', // Thêm người duyệt
    ];

    protected $casts = [
        'total_amount'    => 'decimal:2',
        'discount_amount' => 'decimal:2',
    ];

    // ─── Relationships ───────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function paymentMethod(): BelongsTo
    {
        return $this->belongsTo(PaymentMethod::class);
    }

    public function processor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'processed_by_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function coupon(): BelongsTo
    {
        return $this->belongsTo(Coupon::class);
    }

    // ─── Business Logic ──────────────────────────────────────────────

    /**
     * Áp dụng mã giảm giá vào đơn hàng.
     * Gọi hàm này TRƯỚC KHI save() đơn hàng.
     *
     * Ví dụ sử dụng trong Controller / Service:
     *   $order->applyCoupon($coupon);
     *   $order->save();
     *   $coupon->incrementUsage();
     *
     * @param  Coupon $coupon
     * @return static
     */
    public function applyCoupon(Coupon $coupon): static
    {
        $discount = $coupon->calculateDiscount((float) $this->total_amount);

        $this->coupon_id       = $coupon->id;
        $this->discount_amount = $discount;
        $this->total_amount    = max(0, (float) $this->total_amount - $discount);

        return $this;
    }

    /**
     * Accessor: Tổng tiền TRƯỚC giảm giá (để hiển thị cho người dùng).
     */
    public function getOriginalAmountAttribute(): float
    {
        return (float) $this->total_amount + (float) $this->discount_amount;
    }
}
