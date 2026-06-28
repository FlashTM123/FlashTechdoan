<?php

use App\Models\Brand;
use App\Models\Category;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\PaymentMethod;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Support\Facades\Event;
use App\Events\OrderCreated;

// =====================================================================
// CHỨC NĂNG 1: ĐẶT HÀNG (CHECKOUT)
// Kỹ thuật kiểm thử: Black-Box Testing (Phân vùng tương đương +
//                    Phân tích giá trị biên)
// =====================================================================

// --- Helpers -----------------------------------------------------------
function makeCustomer(): User
{
    return User::factory()->create([
        'role'      => 'customer',
        'is_active' => true,
    ]);
}

function makePaymentMethod(): PaymentMethod
{
    return PaymentMethod::create([
        'name'   => 'Thanh toán khi nhận hàng',
        'code'   => 'cod',
        'status' => true,
    ]);
}

function makeProductWithVariant(int $stock = 10, float $price = 15_000_000): array
{
    $category = Category::create(['name' => 'Laptop', 'slug' => 'laptop-' . uniqid()]);
    $brand    = Brand::create([
        'name'      => 'TestBrand',
        'slug'      => 'testbrand-' . uniqid(),
        'is_active' => true,
    ]);

    $product = Product::create([
        'category_id'   => $category->id,
        'brand_id'      => $brand->id,
        'name'          => 'Laptop Test ' . uniqid(),
        'slug'          => 'laptop-test-' . uniqid(),
        'is_active'     => true,
        'is_featured'   => false,
        'thumbnail_url' => 'https://example.com/img.jpg',
    ]);

    $variant = ProductVariant::create([
        'product_id'   => $product->id,
        'variant_name' => 'i5 8GB 256SSD',
        'price'        => $price,
        'stock'        => $stock,
        'sku'          => 'SKU-' . uniqid(),
    ]);

    return [$product, $variant];
}

// ======================================================================
// TC-CH-01: Đặt hàng thành công với COD
// ======================================================================
it('TC-CH-01: đặt hàng thành công với thanh toán COD', function () {
    Event::fake([OrderCreated::class]);

    $customer      = makeCustomer();
    $paymentMethod = makePaymentMethod();
    [, $variant]  = makeProductWithVariant(stock: 5, price: 15_000_000);

    $response = $this->actingAs($customer)->postJson('/checkout', [
        'shipping_address'  => '123 Nguyễn Trãi, Quận 1, TP.HCM',
        'phone'             => '0901234567',
        'payment_method_id' => $paymentMethod->id,
        'items'             => [
            ['variant_id' => $variant->id, 'quantity' => 2],
        ],
    ]);

    $response->assertStatus(200)
             ->assertJsonPath('status', 'success');

    // Kiểm tra đơn hàng đã được lưu vào DB
    $this->assertDatabaseHas('orders', [
        'user_id'      => $customer->id,
        'total_amount' => 30_000_000,
    ]);

    // Kiểm tra tồn kho giảm đúng
    $this->assertDatabaseHas('product_variants', [
        'id'    => $variant->id,
        'stock' => 3, // 5 - 2
    ]);

    Event::assertDispatched(OrderCreated::class);
});

// ======================================================================
// TC-CH-02: Đặt hàng khi chưa đăng nhập → bị từ chối (redirect)
// ======================================================================
it('TC-CH-02: chưa đăng nhập thì không thể đặt hàng', function () {
    $paymentMethod = makePaymentMethod();
    [, $variant]  = makeProductWithVariant();

    $response = $this->postJson('/checkout', [
        'shipping_address'  => '123 Test Street',
        'phone'             => '0901234567',
        'payment_method_id' => $paymentMethod->id,
        'items'             => [
            ['variant_id' => $variant->id, 'quantity' => 1],
        ],
    ]);

    // Inertia/Laravel trả 401 hoặc redirect cho unauthenticated
    $response->assertStatus(401);
});

// ======================================================================
// TC-CH-03: Đặt hàng vượt quá tồn kho → báo lỗi
// ======================================================================
it('TC-CH-03: đặt số lượng vượt quá tồn kho thì báo lỗi', function () {
    $customer      = makeCustomer();
    $paymentMethod = makePaymentMethod();
    [, $variant]  = makeProductWithVariant(stock: 2);

    $response = $this->actingAs($customer)->postJson('/checkout', [
        'shipping_address'  => '123 Test, Q1, HCM',
        'phone'             => '0901234567',
        'payment_method_id' => $paymentMethod->id,
        'items'             => [
            ['variant_id' => $variant->id, 'quantity' => 10], // vượt quá stock = 2
        ],
    ]);

    $response->assertStatus(400)
             ->assertJsonPath('status', 'error');

    // Đảm bảo không có đơn hàng nào được tạo
    $this->assertDatabaseCount('orders', 0);

    // Tồn kho không thay đổi
    $this->assertDatabaseHas('product_variants', [
        'id'    => $variant->id,
        'stock' => 2,
    ]);
});

// ======================================================================
// TC-CH-04: Thiếu trường bắt buộc (địa chỉ giao hàng) → validation fail
// ======================================================================
it('TC-CH-04: thiếu địa chỉ giao hàng thì validation thất bại', function () {
    $customer      = makeCustomer();
    $paymentMethod = makePaymentMethod();
    [, $variant]  = makeProductWithVariant();

    $response = $this->actingAs($customer)->postJson('/checkout', [
        // Bỏ qua shipping_address
        'phone'             => '0901234567',
        'payment_method_id' => $paymentMethod->id,
        'items'             => [
            ['variant_id' => $variant->id, 'quantity' => 1],
        ],
    ]);

    $response->assertStatus(422)
             ->assertJsonValidationErrors(['shipping_address']);
});

// ======================================================================
// TC-CH-05: Đặt hàng không có sản phẩm (items rỗng) → validation fail
// ======================================================================
it('TC-CH-05: danh sách sản phẩm rỗng thì validation thất bại', function () {
    $customer      = makeCustomer();
    $paymentMethod = makePaymentMethod();

    $response = $this->actingAs($customer)->postJson('/checkout', [
        'shipping_address'  => '123 Test, Q1',
        'phone'             => '0901234567',
        'payment_method_id' => $paymentMethod->id,
        'items'             => [], // mảng rỗng
    ]);

    $response->assertStatus(422)
             ->assertJsonValidationErrors(['items']);
});

// ======================================================================
// TC-CH-06: Đặt hàng với mã giảm giá hợp lệ → tổng tiền giảm đúng
// ======================================================================
it('TC-CH-06: áp dụng coupon hợp lệ khi đặt hàng thì tổng tiền được tính đúng', function () {
    Event::fake([OrderCreated::class]);

    $customer      = makeCustomer();
    $paymentMethod = makePaymentMethod();
    [, $variant]  = makeProductWithVariant(stock: 5, price: 10_000_000);

    $coupon = Coupon::create([
        'code'       => 'SAVE10',
        'type'       => 'percent',
        'value'      => 10, // 10%
        'is_active'  => true,
        'used_count' => 0,
    ]);

    $response = $this->actingAs($customer)->postJson('/checkout', [
        'shipping_address'  => '456 Lê Lợi, Q3, HCM',
        'phone'             => '0909123456',
        'payment_method_id' => $paymentMethod->id,
        'coupon_code'       => 'SAVE10',
        'items'             => [
            ['variant_id' => $variant->id, 'quantity' => 1],
        ],
    ]);

    $response->assertStatus(200)
             ->assertJsonPath('status', 'success');

    // Tổng tiền = 10.000.000 - 10% = 9.000.000
    $this->assertDatabaseHas('orders', [
        'user_id'         => $customer->id,
        'discount_amount' => 1_000_000,
        'total_amount'    => 9_000_000,
    ]);
});

// ======================================================================
// TC-CH-07: Đặt hàng → Giỏ hàng DB của user được xóa
// ======================================================================
it('TC-CH-07: sau khi đặt hàng thành công giỏ hàng trong DB bị xóa', function () {
    Event::fake([OrderCreated::class]);

    $customer      = makeCustomer();
    $paymentMethod = makePaymentMethod();
    [, $variant]  = makeProductWithVariant(stock: 5);

    // Thêm item vào giỏ hàng của user trong DB
    \App\Models\CartItem::create([
        'user_id'            => $customer->id,
        'product_variant_id' => $variant->id,
        'quantity'           => 1,
    ]);

    $this->assertDatabaseCount('cart_items', 1);

    $this->actingAs($customer)->postJson('/checkout', [
        'shipping_address'  => '789 CMT8, Q10',
        'phone'             => '0912000000',
        'payment_method_id' => $paymentMethod->id,
        'items'             => [
            ['variant_id' => $variant->id, 'quantity' => 1],
        ],
    ]);

    // Giỏ hàng phải sạch
    $this->assertDatabaseCount('cart_items', 0);
});
