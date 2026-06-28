<?php

use App\Models\Brand;
use App\Models\Category;
use App\Models\Coupon;
use App\Models\PaymentMethod;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use Carbon\Carbon;

// ======================================================================
// CHỨC NĂNG 2: MÃ GIẢM GIÁ (COUPON)
// Kỹ thuật kiểm thử: Black-Box Testing – Phân vùng tương đương &
//                    Bảng quyết định (Decision Table Testing)
// Endpoint kiểm thử: POST /coupon/apply
// ======================================================================

// --- Helpers -----------------------------------------------------------
function makeCouponCustomer(): User
{
    return User::factory()->create([
        'role'      => 'customer',
        'is_active' => true,
    ]);
}

function makeActiveCoupon(array $override = []): Coupon
{
    return Coupon::create(array_merge([
        'code'             => 'TEST' . strtoupper(uniqid()),
        'type'             => 'percent',
        'value'            => 10,
        'min_order_amount' => 0,      // unsignedInteger NOT NULL default 0
        'usage_limit'      => null,   // nullable – không giới hạn
        'used_count'       => 0,
        'is_active'        => true,
        'expires_at'       => null,
    ], $override));
}

// ======================================================================
// TC-CPN-01: Mã giảm giá hợp lệ (phần trăm) → trả về đúng số tiền giảm
// ======================================================================
it('TC-CPN-01: mã giảm giá phần trăm hợp lệ thì trả về discount đúng', function () {
    $user   = makeCouponCustomer();
    $coupon = makeActiveCoupon([
        'code'  => 'SUMMER20',
        'type'  => 'percent',
        'value' => 20,
    ]);

    $response = $this->actingAs($user)->postJson('/coupon/apply', [
        'code'        => 'SUMMER20',
        'order_total' => 10_000_000,
    ]);

    $response->assertStatus(200)
             ->assertJsonPath('status', 'success')
             ->assertJsonPath('discount_amount', 2_000_000)   // 20% × 10tr = 2tr
             ->assertJsonPath('final_total', 8_000_000);
});

// ======================================================================
// TC-CPN-02: Mã giảm giá cố định (fixed) → trả về đúng số tiền giảm
// ======================================================================
it('TC-CPN-02: mã giảm giá cố định hợp lệ thì trả về discount đúng', function () {
    $user   = makeCouponCustomer();
    $coupon = makeActiveCoupon([
        'code'  => 'FIXED500K',
        'type'  => 'fixed',
        'value' => 500_000,
    ]);

    $response = $this->actingAs($user)->postJson('/coupon/apply', [
        'code'        => 'FIXED500K',
        'order_total' => 5_000_000,
    ]);

    $response->assertStatus(200)
             ->assertJsonPath('status', 'success')
             ->assertJsonPath('discount_amount', 500_000)
             ->assertJsonPath('final_total', 4_500_000);
});

// ======================================================================
// TC-CPN-03: Mã không tồn tại → báo lỗi 404
// ======================================================================
it('TC-CPN-03: mã không tồn tại thì trả về 404', function () {
    $user = makeCouponCustomer();

    $response = $this->actingAs($user)->postJson('/coupon/apply', [
        'code'        => 'KHONGTONTAI',
        'order_total' => 5_000_000,
    ]);

    $response->assertStatus(404)
             ->assertJsonPath('status', 'error');
});

// ======================================================================
// TC-CPN-04: Mã đã hết hạn → báo lỗi 422
// ======================================================================
it('TC-CPN-04: mã đã hết hạn thì báo lỗi', function () {
    $user   = makeCouponCustomer();
    makeActiveCoupon([
        'code'       => 'EXPIRED',
        'expires_at' => Carbon::yesterday(),
    ]);

    $response = $this->actingAs($user)->postJson('/coupon/apply', [
        'code'        => 'EXPIRED',
        'order_total' => 5_000_000,
    ]);

    $response->assertStatus(422)
             ->assertJsonPath('status', 'error');
});

// ======================================================================
// TC-CPN-05: Mã đã đạt giới hạn sử dụng → báo lỗi 422
// ======================================================================
it('TC-CPN-05: mã vượt giới hạn sử dụng thì báo lỗi', function () {
    $user   = makeCouponCustomer();
    makeActiveCoupon([
        'code'        => 'MAXOUT',
        'usage_limit' => 5,
        'used_count'  => 5, // đã dùng đủ giới hạn
    ]);

    $response = $this->actingAs($user)->postJson('/coupon/apply', [
        'code'        => 'MAXOUT',
        'order_total' => 5_000_000,
    ]);

    $response->assertStatus(422)
             ->assertJsonPath('status', 'error');
});

// ======================================================================
// TC-CPN-06: Mã không active (is_active = false) → báo lỗi 422
// ======================================================================
it('TC-CPN-06: mã bị vô hiệu hoá thì báo lỗi', function () {
    $user   = makeCouponCustomer();
    makeActiveCoupon([
        'code'      => 'DISABLED',
        'is_active' => false,
    ]);

    $response = $this->actingAs($user)->postJson('/coupon/apply', [
        'code'        => 'DISABLED',
        'order_total' => 5_000_000,
    ]);

    $response->assertStatus(422)
             ->assertJsonPath('status', 'error');
});

// ======================================================================
// TC-CPN-07: Đơn hàng chưa đạt giá trị tối thiểu → báo lỗi 422
// ======================================================================
it('TC-CPN-07: đơn hàng chưa đạt giá trị tối thiểu thì báo lỗi', function () {
    $user   = makeCouponCustomer();
    makeActiveCoupon([
        'code'             => 'MINORDER',
        'min_order_amount' => 5_000_000,
    ]);

    $response = $this->actingAs($user)->postJson('/coupon/apply', [
        'code'        => 'MINORDER',
        'order_total' => 2_000_000, // thấp hơn min_order_amount
    ]);

    $response->assertStatus(422)
             ->assertJsonPath('status', 'error');
});

// ======================================================================
// TC-CPN-08: Giảm giá cố định lớn hơn tổng đơn → final_total = 0 (không âm)
// ======================================================================
it('TC-CPN-08: discount cố định lớn hơn tổng đơn thì final total bằng 0', function () {
    $user   = makeCouponCustomer();
    makeActiveCoupon([
        'code'  => 'BIGDISCOUNT',
        'type'  => 'fixed',
        'value' => 999_999_999,
    ]);

    $response = $this->actingAs($user)->postJson('/coupon/apply', [
        'code'        => 'BIGDISCOUNT',
        'order_total' => 1_000_000,
    ]);

    $response->assertStatus(200)
             ->assertJsonPath('status', 'success')
             ->assertJsonPath('final_total', 0);
});

// ======================================================================
// TC-CPN-09: Truy cập không cần đăng nhập → 401
// ======================================================================
it('TC-CPN-09: không đăng nhập thì không thể dùng coupon endpoint', function () {
    $response = $this->postJson('/coupon/apply', [
        'code'        => 'ANYCODE',
        'order_total' => 5_000_000,
    ]);

    $response->assertStatus(401);
});
