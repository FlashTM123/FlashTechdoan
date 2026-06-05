<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ProductVariant;
use App\Models\PaymentMethod;
use App\Services\VnpayService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    protected $vnpayService;

    public function __construct(VnpayService $vnpayService)
    {
        $this->vnpayService = $vnpayService;
    }

    /**
     * Hiển thị trang Checkout
     */
    public function index()
    {
        $paymentMethods = PaymentMethod::where('status', true)->get();

        // Load thông tin profile để Frontend tự động điền
        auth()->user()?->load('profile');

        return Inertia::render('Checkout', [
            'paymentMethods' => $paymentMethods
        ]);
    }

    /**
     * Xử lý đặt hàng
     */
    public function placeOrder(Request $request)
    {
        $request->validate([
            'shipping_address' => 'required|string',
            'phone'            => 'required|string',
            'payment_method_id'=> 'required|exists:payment_methods,id',
            'items'            => 'required|array',
            'items.*.variant_id' => 'required|exists:product_variants,id',
            'items.*.quantity'   => 'required|integer|min:1',
            'coupon_code'      => 'nullable|string',
        ]);

        $user = $request->user();
        $items = $request->items;
        $paymentMethod = PaymentMethod::find($request->payment_method_id);

        try {
            return DB::transaction(function () use ($user, $request, $items, $paymentMethod) {
                $totalAmount = 0;
                $orderItemsData = [];

                // 1. Xác thực giá và tồn kho (Bảo mật: Không tin tưởng giá từ Frontend)
                foreach ($items as $item) {
                    $variant = ProductVariant::lockForUpdate()->find($item['variant_id']);

                    if ($variant->stock < $item['quantity']) {
                        throw new \Exception("Sản phẩm {$variant->variant_name} không đủ tồn kho.");
                    }

                    // Lấy giá trực tiếp từ Database
                    $itemTotal = $variant->price * $item['quantity'];
                    $totalAmount += $itemTotal;

                    $orderItemsData[] = [
                        'product_id'          => $variant->product_id,
                        'product_variants_id' => $variant->id,
                        'quantity'            => $item['quantity'],
                        'unit_price'          => $variant->price,
                    ];

                    // 2. Trừ tồn kho
                    $variant->decrement('stock', $item['quantity']);
                }

                // 2.5 Xác thực mã giảm giá (nếu có)
                $coupon        = null;
                $discountAmount = 0;
                $couponId      = null;

                if ($request->filled('coupon_code')) {
                    $coupon = Coupon::where('code', strtoupper(trim($request->coupon_code)))->first();

                    if ($coupon && $coupon->isValid()) {
                        $discountAmount = $coupon->calculateDiscount((float) $totalAmount);
                        $totalAmount    = max(0, $totalAmount - $discountAmount);
                        $couponId       = $coupon->id;
                    }
                }

                // 3. Tạo đơn hàng (orders)
                $order = Order::create([
                    'user_id'           => $user->id,
                    'order_code'        => 'FT' . strtoupper(Str::random(10)),
                    'total_amount'      => $totalAmount,
                    'shipping_address'  => $request->shipping_address . " (SĐT: " . $request->phone . ")",
                    'payment_method_id' => $paymentMethod->id,
                    'payment_status'    => 'pending',
                    'order_status'      => 'pending',
                    'notes'             => $request->notes,
                    'coupon_id'         => $couponId,
                    'discount_amount'   => $discountAmount,
                ]);

                // 4. Tạo chi tiết đơn hàng (order_items)
                foreach ($orderItemsData as $orderItem) {
                    $orderItem['order_id'] = $order->id;
                    \App\Models\OrderItem::create($orderItem);
                }

                // 4.2 Tăng số lần dùng coupon
                if ($coupon) {
                    $coupon->incrementUsage();
                }

                // PHÁT SỰ KIỆN: Thông báo đơn hàng mới cho Admin
                event(new \App\Events\OrderCreated($order));

                // 4.5 Xóa giỏ hàng trong Database sau khi đặt hàng thành công
                \App\Models\CartItem::where('user_id', $user->id)->delete();

                // 5. Xử lý chuyển hướng thanh toán (Cả VNPAY và Chuyển khoản đều qua VNPAY cho đồ án)
                $vnpayCodes = ['vnpay', 'bank_transfer'];
                if (in_array($paymentMethod->code, $vnpayCodes)) {
                    $vnpayUrl = $this->vnpayService->createPaymentUrl($order);
                    return response()->json([
                        'status' => 'success',
                        'message' => 'Đơn hàng đã được tạo, đang chuyển hướng thanh toán.',
                        'payment_url' => $vnpayUrl,
                        'order_code' => $order->order_code
                    ]);
                }

                return response()->json([
                    'status' => 'success',
                    'message' => 'Đặt hàng thành công!',
                    'order_code' => $order->order_code
                ]);
            });
        } catch (\Exception $e) {
            Log::error("Checkout Error: " . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Hiển thị trang thông báo thành công
     */
    public function success(Request $request)
    {
        $order = Order::with(['items.product', 'items.variant', 'paymentMethod', 'coupon', 'user'])
            ->where('order_code', $request->order_code)
            ->first();

        return Inertia::render('Checkout/Success', [
            'order_code' => $request->order_code,
            'order' => $order
        ]);
    }

    /**
     * Hiển thị trang thông báo thất bại
     */
    public function fail(Request $request)
    {
        return Inertia::render('Checkout/Fail', [
            'order_code' => $request->order_code
        ]);
    }

    /**
     * Xử lý kết quả trả về từ VNPAY (Return URL)
     */
    public function vnpayReturn(Request $request)
    {
        $data = $request->all();
        $isValid = $this->vnpayService->verifyReturn($data);

        if ($isValid) {
            $orderCode = $data['vnp_TxnRef'];
            $vnpResponseCode = $data['vnp_ResponseCode'];
            $order = Order::where('order_code', $orderCode)->first();

            if ($order) {
                if ($vnpResponseCode == '00') {
                    $order->update(['payment_status' => 'paid']);
                    // Chuyển hướng về trang thành công ở Frontend
                    return redirect()->away(env('FRONTEND_URL', 'http://localhost:5173') . "/checkout/success?order_code=" . $orderCode);
                } else {
                    $order->update(['payment_status' => 'failed']);
                    return redirect()->away(env('FRONTEND_URL', 'http://localhost:5173') . "/checkout/fail?order_code=" . $orderCode);
                }
            }
        }

        return redirect()->away(env('FRONTEND_URL', 'http://localhost:5173') . "/checkout/fail");
    }
}
