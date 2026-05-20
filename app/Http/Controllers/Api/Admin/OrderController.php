<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;

class OrderController extends Controller
{
    /**
     * Lấy danh sách tất cả đơn hàng (Admin Panel).
     *
     * Eager Loading:
     * - user: thông tin khách hàng đặt hàng
     * - processor: thông tin nhân viên duyệt (nullable)
     * - paymentMethod: phương thức thanh toán
     * - items: các sản phẩm trong đơn hàng
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $orders = Order::query()
            ->with([
                'user:id,name,email,phone',
                'processor:id,name,email,employee_code,role',
                'paymentMethod:id,name',
                'items.product:id,name,slug',
                'items.variant:id,sku,size,color',
                'coupon:id,code,type,value'
            ])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'message' => 'Danh sách đơn hàng',
            'data' => $orders->items(),
            'pagination' => [
                'total' => $orders->total(),
                'per_page' => $orders->perPage(),
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
                'from' => $orders->firstItem(),
                'to' => $orders->lastItem(),
            ]
        ], 200);
    }

    /**
     * Lấy chi tiết 1 đơn hàng cụ thể.
     *
     * Trả về:
     * - Thông tin order (id, code, status, amount, etc)
     * - Khách hàng (user)
     * - Nhân viên xử lý nếu có (processor - nullable)
     * - Mã giảm giá (coupon)
     * - Các sản phẩm trong đơn (items)
     *
     * @param  Order $order
     * @return JsonResponse
     */
    public function show(Order $order): JsonResponse
    {
        $order->load([
            'user:id,name,email,phone,role',
            'processor:id,name,email,employee_code,role',
            'paymentMethod:id,name',
            'items.product:id,name,slug,sku',
            'items.variant:id,sku,size,color,price',
            'coupon:id,code,type,value,discount_amount'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Chi tiết đơn hàng',
            'data' => [
                'order' => [
                    'id' => $order->id,
                    'order_code' => $order->order_code,
                    'order_status' => $order->order_status,
                    'payment_status' => $order->payment_status,
                    'total_amount' => (float) $order->total_amount,
                    'original_amount' => (float) $order->getOriginalAmountAttribute(),
                    'discount_amount' => (float) $order->discount_amount,
                    'shipping_address' => $order->shipping_address,
                    'notes' => $order->notes,
                    'created_at' => $order->created_at,
                    'updated_at' => $order->updated_at,
                ],
                'customer' => $order->user ? [
                    'id' => $order->user->id,
                    'name' => $order->user->name,
                    'email' => $order->user->email,
                    'phone' => $order->user->phone ?? null,
                    'role' => $order->user->role,
                ] : null,
                'processor' => $order->processor ? [
                    'id' => $order->processor->id,
                    'name' => $order->processor->name,
                    'email' => $order->processor->email,
                    'employee_code' => $order->processor->employee_code,
                    'role' => $order->processor->role,
                ] : null,
                'payment_method' => $order->paymentMethod ? [
                    'id' => $order->paymentMethod->id,
                    'name' => $order->paymentMethod->name,
                ] : null,
                'coupon' => $order->coupon ? [
                    'id' => $order->coupon->id,
                    'code' => $order->coupon->code,
                    'type' => $order->coupon->type,
                    'value' => (float) $order->coupon->value,
                ] : null,
                'items' => $order->items->map(fn ($item) => [
                    'id' => $item->id,
                    'product' => [
                        'id' => $item->product->id ?? null,
                        'name' => $item->product->name ?? null,
                        'slug' => $item->product->slug ?? null,
                    ],
                    'variant' => $item->variant ? [
                        'id' => $item->variant->id,
                        'sku' => $item->variant->sku,
                        'size' => $item->variant->size ?? null,
                        'color' => $item->variant->color ?? null,
                        'price' => (float) ($item->variant->price ?? 0),
                    ] : null,
                    'quantity' => $item->quantity,
                    'unit_price' => (float) $item->unit_price,
                    'subtotal' => (float) ($item->quantity * $item->unit_price),
                ])->toArray(),
            ]
        ], 200);
    }
}
