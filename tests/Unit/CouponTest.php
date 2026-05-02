<?php

namespace Tests\Unit;

use App\Models\Coupon;
use Tests\TestCase;
use Illuminate\Support\Carbon;

class CouponTest extends TestCase
{
    /**
     * Test Case 1: Kiểm tra mã hợp lệ.
     * Một coupon phải trả về true khi: is_active = true và chưa hết hạn.
     */
    public function test_coupon_is_valid_when_active_and_not_expired(): void
    {
        // 1. Sắp đặt (Arrange): Tạo một đối tượng Coupon giả lập trong bộ nhớ (không lưu DB)
        $coupon = new Coupon([
            'code' => 'SALE10',
            'is_active' => true,
            'expires_at' => Carbon::now()->addDays(1), // Hết hạn vào ngày mai
        ]);

        // 2. Thực thi (Act): Gọi hàm isValid()
        $result = $coupon->isValid();

        // 3. Khẳng định (Assert): Kết quả phải là true
        $this->assertTrue($result, 'Coupon còn hạn và đang active phải hợp lệ.');
    }

    /**
     * Test Case 2: Kiểm tra mã hết hạn.
     * Một coupon phải trả về false khi ngày hết hạn là ngày hôm qua.
     */
    public function test_coupon_is_invalid_when_expired(): void
    {
        // 1. Sắp đặt: Ngày hết hạn là hôm qua
        $coupon = new Coupon([
            'code' => 'EXPIRED',
            'is_active' => true,
            'expires_at' => Carbon::now()->subDay(), // Đã hết hạn từ hôm qua
        ]);

        // 2. Thực thi
        $result = $coupon->isValid();

        // 3. Khẳng định
        $this->assertFalse($result, 'Coupon đã hết hạn không được phép hợp lệ.');
    }

    /**
     * Test Case phụ: Kiểm tra mã bị tắt (is_active = false)
     */
    public function test_coupon_is_invalid_when_inactive(): void
    {
        $coupon = new Coupon([
            'code' => 'INACTIVE',
            'is_active' => false,
            'expires_at' => Carbon::now()->addDays(1),
        ]);

        $this->assertFalse($coupon->isValid());
    }
}
