<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    /**
     * Kiểm tra và áp dụng mã giảm giá.
     */
    public function apply(Request $request)
    {
        $request->validate([
            'code'        => 'required|string',
            'order_total' => 'required|numeric|min:0',
        ]);

        $coupon = Coupon::where('code', strtoupper(trim($request->code)))->first();

        if (!$coupon) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Mã giảm giá không tồn tại.',
            ], 404);
        }

        if (!$coupon->isValid()) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Mã giảm giá đã hết hạn hoặc không còn hiệu lực.',
            ], 422);
        }

        if ($coupon->min_order_amount && $request->order_total < $coupon->min_order_amount) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Đơn hàng chưa đạt giá trị tối thiểu ' . number_format($coupon->min_order_amount, 0, ',', '.') . 'đ để áp dụng mã này.',
            ], 422);
        }

        $discountAmount = $coupon->calculateDiscount((float) $request->order_total);

        return response()->json([
            'status'          => 'success',
            'message'         => 'Áp dụng mã giảm giá thành công!',
            'coupon_code'     => $coupon->code,
            'type'            => $coupon->type,
            'value'           => $coupon->value,
            'discount_amount' => $discountAmount,
            'final_total'     => max(0, (float) $request->order_total - $discountAmount),
        ]);
    }
}
