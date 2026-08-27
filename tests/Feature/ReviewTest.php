<?php

use App\Models\Brand;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\PaymentMethod;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Review;
use App\Models\User;
use Illuminate\Support\Str;

// ======================================================================
// CHỨC NĂNG 3: ĐÁNH GIÁ SẢN PHẨM (REVIEW)
// Kỹ thuật kiểm thử: Black-Box Testing – Phân vùng tương đương &
//                    Use-Case Testing (luồng kịch bản đầy đủ)
// Endpoint: POST /products/{product}/reviews
//           GET  /products/{product}/reviews
// ======================================================================

// --- Helpers -----------------------------------------------------------

function reviewMakeCustomer(): User
{
    return User::factory()->create([
        'role'      => 'customer',
        'is_active' => true,
    ]);
}

function reviewMakeProduct(): Product
{
    $category = Category::create(['name' => 'Laptop', 'slug' => 'laptop-rv-' . uniqid()]);
    $brand    = Brand::create([
        'name'      => 'BrandRv',
        'slug'      => 'brand-rv-' . uniqid(),
        'is_active' => true,
    ]);

    return Product::create([
        'category_id'   => $category->id,
        'brand_id'      => $brand->id,
        'name'          => 'Laptop Review Test ' . uniqid(),
        'slug'          => 'laptop-rv-' . uniqid(),
        'is_active'     => true,
        'is_featured'   => false,
        'thumbnail_url' => 'https://example.com/img.jpg',
    ]);
}

/**
 * Tạo đơn hàng đã giao (delivered) cho user & product để có quyền đánh giá.
 */
function reviewMakeDeliveredOrder(User $user, Product $product): Order
{
    $pm = PaymentMethod::create([
        'name'   => 'COD',
        'code'   => 'cod-' . uniqid(),
        'status' => true,
    ]);

    $variant = ProductVariant::create([
        'product_id'   => $product->id,
        'variant_name' => 'i7 16GB',
        'price'        => 20_000_000,
        'stock'        => 10,
        'sku'          => 'SKU-' . uniqid(),
    ]);

    $order = Order::create([
        'user_id'           => $user->id,
        'order_code'        => 'FT' . strtoupper(Str::random(10)),
        'total_amount'      => 20_000_000,
        'shipping_address'  => '123 Test Street',
        'payment_method_id' => $pm->id,
        'payment_status'    => 'paid',
        'order_status'      => 'delivered',
    ]);

    OrderItem::create([
        'order_id'            => $order->id,
        'product_id'          => $product->id,
        'product_variants_id' => $variant->id,
        'quantity'            => 1,
        'unit_price'          => 20_000_000,
    ]);

    return $order;
}

// ======================================================================
// TC-RV-01: Gửi đánh giá thành công khi đã mua hàng (delivered)
// ======================================================================
it('TC-RV-01: khách hàng đã mua hàng thành công có thể gửi đánh giá', function () {
    $user    = reviewMakeCustomer();
    $product = reviewMakeProduct();
    reviewMakeDeliveredOrder($user, $product);

    $response = $this->actingAs($user)->postJson("/products/{$product->id}/reviews", [
        'rating'  => 5,
        'content' => 'Sản phẩm rất tốt, giao hàng đúng hạn, đóng gói cẩn thận.',
    ]);

    $response->assertStatus(201);

    $this->assertDatabaseHas('reviews', [
        'user_id'    => $user->id,
        'product_id' => $product->id,
        'rating'     => 5,
        'status'     => 'pending', // Chờ admin duyệt
    ]);
});

// ======================================================================
// TC-RV-02: Khách chưa mua hàng không thể gửi đánh giá (403)
// ======================================================================
it('TC-RV-02: khách chưa mua hàng thì bị từ chối đánh giá', function () {
    $user    = reviewMakeCustomer();
    $product = reviewMakeProduct();
    // Không tạo order → chưa mua

    $response = $this->actingAs($user)->postJson("/products/{$product->id}/reviews", [
        'rating'  => 4,
        'content' => 'Tôi nghĩ sản phẩm này có vẻ ổn nhỉ.',
    ]);

    $response->assertStatus(403);
    $this->assertDatabaseCount('reviews', 0);
});

// ======================================================================
// TC-RV-03: Khách có đơn hàng nhưng chưa delivered thì không được đánh giá
// ======================================================================
it('TC-RV-03: đơn hàng ở trạng thái pending chưa được phép đánh giá', function () {
    $user    = reviewMakeCustomer();
    $product = reviewMakeProduct();

    $pm = PaymentMethod::create(['name' => 'COD2', 'code' => 'cod2-' . uniqid(), 'status' => true]);
    $variant = ProductVariant::create([
        'product_id'   => $product->id,
        'variant_name' => 'i5 8GB',
        'price'        => 10_000_000,
        'stock'        => 5,
        'sku'          => 'SKU-' . uniqid(),
    ]);

    $order = Order::create([
        'user_id'           => $user->id,
        'order_code'        => 'FT' . strtoupper(Str::random(10)),
        'total_amount'      => 10_000_000,
        'shipping_address'  => 'Test',
        'payment_method_id' => $pm->id,
        'payment_status'    => 'pending',
        'order_status'      => 'pending', // Chưa giao
    ]);

    OrderItem::create([
        'order_id'            => $order->id,
        'product_id'          => $product->id,
        'product_variants_id' => $variant->id,
        'quantity'            => 1,
        'unit_price'          => 10_000_000,
    ]);

    $response = $this->actingAs($user)->postJson("/products/{$product->id}/reviews", [
        'rating'  => 3,
        'content' => 'Đơn hàng đang chờ xử lý mà vẫn muốn đánh giá.',
    ]);

    $response->assertStatus(403);
    $this->assertDatabaseCount('reviews', 0);
});

// ======================================================================
// TC-RV-04: Chưa đăng nhập → không thể gửi đánh giá (401)
// ======================================================================
it('TC-RV-04: chưa đăng nhập thì không thể gửi đánh giá', function () {
    $product = reviewMakeProduct();

    $response = $this->postJson("/products/{$product->id}/reviews", [
        'rating'  => 5,
        'content' => 'Sản phẩm tuyệt vời thực sự.',
    ]);

    $response->assertStatus(401);
    $this->assertDatabaseCount('reviews', 0);
});

// ======================================================================
// TC-RV-05: Thiếu trường rating → validation fail (422)
// ======================================================================
it('TC-RV-05: gửi đánh giá thiếu rating thì bị lỗi validation', function () {
    $user    = reviewMakeCustomer();
    $product = reviewMakeProduct();
    reviewMakeDeliveredOrder($user, $product);

    $response = $this->actingAs($user)->postJson("/products/{$product->id}/reviews", [
        // thiếu 'rating'
        'content' => 'Sản phẩm khá tốt nhưng quên không nhập số sao.',
    ]);

    $response->assertStatus(422)
             ->assertJsonValidationErrors(['rating']);
});

// ======================================================================
// TC-RV-06: Content quá ngắn (dưới 10 ký tự) → validation fail (422)
// ======================================================================
it('TC-RV-06: nội dung đánh giá quá ngắn thì bị lỗi validation', function () {
    $user    = reviewMakeCustomer();
    $product = reviewMakeProduct();
    reviewMakeDeliveredOrder($user, $product);

    $response = $this->actingAs($user)->postJson("/products/{$product->id}/reviews", [
        'rating'  => 4,
        'content' => 'Tốt', // chỉ 3 ký tự, yêu cầu min:10
    ]);

    $response->assertStatus(422)
             ->assertJsonValidationErrors(['content']);
});

// ======================================================================
// TC-RV-07: Rating nằm ngoài khoảng 1-5 → validation fail
// ======================================================================
it('TC-RV-07: rating vượt ngoài khoảng 1-5 thì bị lỗi validation', function () {
    $user    = reviewMakeCustomer();
    $product = reviewMakeProduct();
    reviewMakeDeliveredOrder($user, $product);

    $response = $this->actingAs($user)->postJson("/products/{$product->id}/reviews", [
        'rating'  => 10, // vượt max:5
        'content' => 'Sản phẩm cực kỳ xuất sắc vượt mọi kỳ vọng của tôi!',
    ]);

    $response->assertStatus(422)
             ->assertJsonValidationErrors(['rating']);
});

// ======================================================================
// TC-RV-08: Lấy danh sách đánh giá (GET) – chỉ hiển thị review visible
// ======================================================================
it('TC-RV-08: lấy danh sách đánh giá chỉ trả về review đã được hiển thị', function () {
    $product = reviewMakeProduct();
    $user1   = reviewMakeCustomer();
    $user2   = reviewMakeCustomer();

    // Review đã được duyệt (is_visible = true)
    Review::create([
        'user_id'    => $user1->id,
        'product_id' => $product->id,
        'rating'     => 5,
        'content'    => 'Laptop tốt, pin trâu, màn đẹp.',
        'is_visible' => true,
        'status'     => 'approved',
    ]);

    // Review chưa được duyệt
    Review::create([
        'user_id'    => $user2->id,
        'product_id' => $product->id,
        'rating'     => 2,
        'content'    => 'Sản phẩm bị lỗi, tôi rất thất vọng.',
        'is_visible' => false,
        'status'     => 'pending',
    ]);

    $response = $this->getJson("/products/{$product->id}/reviews");

    $response->assertStatus(200);
    $data = $response->json('data');
    expect($data)->toHaveCount(1)
                 ->and($data[0]['is_visible'])->toBeTrue();
});
