<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CouponController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Api\CheckoutController;
use App\Http\Controllers\Api\ReviewController;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/product/{id}', [HomeController::class, 'show'])->name('product.show');
Route::get('/products', [HomeController::class, 'product'])->name('products.index');
Route::get('/compare', fn() => Inertia::render('Compare/ComparePage'))->name('compare.index');
Route::get('/about', fn() => Inertia::render('About'))->name('about');
Route::get('/api/search', [HomeController::class, 'apiSearch']);

// Public Reviews
Route::get('/products/{product}/reviews', [ReviewController::class, 'index'])->name('reviews.index');

Route::middleware('auth')->group(function () {
    Route::post('/checkout', [\App\Http\Controllers\Api\CheckoutController::class, 'placeOrder'])->name('checkout.store');
    Route::get('/checkout/success', [\App\Http\Controllers\Api\CheckoutController::class, 'success'])->name('checkout.success');
    Route::get('/checkout/fail', [\App\Http\Controllers\Api\CheckoutController::class, 'failed'])->name('checkout.fail');
});



Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile.show');
    Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/cart', function () {
        return inertia('Cart/CartPage');
    })->name('cart.show');

    Route::get('/api/cart-data', [CartController::class, 'index'])->name('cart.data');
    Route::post('/cart/sync', [CartController::class, 'sync'])->name('cart.sync');
    Route::get('/checkout', [\App\Http\Controllers\Api\CheckoutController::class, 'index'])->name('checkout.index');

    // Order History Routes
    Route::get('/my-orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/my-orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    Route::post('/orders/{order}/cancel', [OrderController::class, 'cancel'])->name('orders.cancel');
    // Reviews
    Route::post('/products/{product}/reviews', [ReviewController::class, 'store'])->name('reviews.store');

    // Coupon
    Route::post('/coupon/apply', [CouponController::class, 'apply'])->name('coupon.apply');
});

Route::middleware(['auth'])->prefix('admin')->group(function () {
    // Không có route nào ở đây vì đã chuyển sang sử dụng Filament
});

require __DIR__ . '/auth.php';
