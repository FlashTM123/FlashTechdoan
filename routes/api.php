<?php

use App\Http\Controllers\Api\CheckoutController;
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

// Reviews

