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

    /**
     * Mối quan hệ đến User (Khách hàng đặt mua đơn hàng).
     * Thông qua: user_id → users.id
     * Ý nghĩa: Lấy thông tin người mua của đơn hàng này.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function paymentMethod(): BelongsTo
    {
        return $this->belongsTo(PaymentMethod::class);
    }

    /**
     * Mối quan hệ đến User (Nhân viên/Admin xử lý đơn hàng).
     * Thông qua: processed_by_id → users.id (có thể NULL nếu chưa ai duyệt)
     * Ý nghĩa: Lấy thông tin nhân viên/admin đã duyệt và xử lý đơn hàng.
     *
     * Cách sử dụng:
     *   $order = Order::with('processor')->find($id);
     *   $processor = $order->processor; // Có thể là null
     *   $processorName = $order->processor?->name; // Nullable chaining
     */
    public function processor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'processed_by_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Mối quan hệ đến Coupon (Mã giảm giá).
     * Thông qua: coupon_id → coupons.id
     * Ý nghĩa: Lấy thông tin mã giảm giá được áp dụng cho đơn hàng.
     */
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
