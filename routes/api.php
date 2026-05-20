<?php

use App\Http\Controllers\Api\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Api\CheckoutController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ReviewController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Route::middleware('auth:sanctum')->group(function () {
//     Route::post('/checkout', [CheckoutController::class, 'placeOrder']);
// });

// VNPAY Callback route (Public)
Route::get('/checkout/vnpay-return', [CheckoutController::class, 'vnpayReturn']);

// Products - Public routes
Route::post('/products/compare', [ProductController::class, 'compare']);

// Reviews

// ─── Admin API Routes ────────────────────────────────────────────
Route::middleware(['auth:sanctum', \App\Http\Middleware\IsAdmin::class])->prefix('admin')->group(function () {
    // Orders Management
    Route::get('orders', [AdminOrderController::class, 'index']);
    Route::get('orders/{order}', [AdminOrderController::class, 'show']);
});

