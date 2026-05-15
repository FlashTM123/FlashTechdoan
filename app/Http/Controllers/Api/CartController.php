<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\CartItem;


class CartController extends Controller
{
    public function index()
    {
        $cart = CartItem::with(['variant.product', 'variant.images'])
            ->where('user_id', auth()->id())
            ->get();

        return response()->json($cart);
    }

    public function sync(Request $request)
    {
        $items = $request->input('items', []);

        foreach ($items as $item) {
            $cartItem = CartItem::where('user_id', auth()->id())
                ->where('product_variant_id', $item['variant_id'])
                ->first();

            if ($item['quantity'] <= 0) {
                // Nếu số lượng bằng 0 hoặc nhỏ hơn, xóa khỏi giỏ hàng
                if ($cartItem) {
                    $cartItem->delete();
                }
                continue;
            }

            if ($cartItem) {
                // CẬP NHẬT số lượng mới nhất (không cộng dồn để tránh lỗi như bạn gặp)
                $cartItem->update([
                    'quantity' => $item['quantity']
                ]);
            } else {
                // Nếu chưa có, tạo mới
                CartItem::create([
                    'user_id' => auth()->id(),
                    'product_variant_id' => $item['variant_id'],
                    'quantity' => $item['quantity']
                ]);
            }
        }

        // Trả về giỏ hàng mới nhất sau khi gộp
        $fullCart = CartItem::with(['variant.product', 'variant.images'])
            ->where('user_id', auth()->id())
            ->get();

        return response()->json([
            'message' => 'Cart synced successfully',
            'cart' => $fullCart
        ]);
    }
}
