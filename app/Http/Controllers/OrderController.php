<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Hiển thị danh sách đơn hàng của người dùng.
     */
    public function index(Request $request)
    {
        $status = $request->query('status');
        
        $orders = Order::where('user_id', auth()->id())
            ->with(['items.product', 'items.variant', 'paymentMethod'])
            ->when($status, function ($query, $status) {
                return $query->where('order_status', $status);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
            'status' => $status,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    /**
     * Hủy đơn hàng.
     */
    public function cancel(Order $order)
    {
        // 1. Kiểm tra quyền sở hữu
        if ($order->user_id !== auth()->id()) {
            return back()->with('error', 'Bạn không có quyền thực hiện hành động này.');
        }

        // 2. Kiểm tra trạng thái đơn hàng (Chỉ cho phép hủy nếu đang 'pending')
        if ($order->order_status !== 'pending') {
            return back()->with('error', 'Không thể hủy đơn hàng đã được xử lý hoặc đã giao.');
        }

        try {
            DB::beginTransaction();

            // 3. Cập nhật trạng thái đơn hàng thành 'cancelled'
            $order->update([
                'order_status' => 'cancelled',
                'payment_status' => $order->payment_status === 'paid' ? 'refunding' : 'failed'
            ]);

            // ĐẢM BẢO LOAD LẠI ITEMS để cộng kho
            $order->load('items');

            // 4. Hoàn trả số lượng vào kho (stock)
            foreach ($order->items as $item) {
                if ($item->product_variants_id) {
                    \App\Models\ProductVariant::where('id', $item->product_variants_id)
                        ->increment('stock', $item->quantity);
                }
            }

            DB::commit();

            // PHÁT SỰ KIỆN: Thông báo trạng thái thay đổi (Hủy đơn)
            event(new \App\Events\OrderStatusUpdated($order));

            return back()->with('success', 'Đơn hàng của bạn đã được hủy thành công.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Có lỗi xảy ra khi hủy đơn hàng. Vui lòng thử lại sau.');
        }
    }
}
