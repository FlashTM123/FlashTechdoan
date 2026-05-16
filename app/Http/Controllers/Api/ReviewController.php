<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ReviewController extends Controller
{
    /**
     * Lấy danh sách đánh giá của một sản phẩm.
     */
    public function index(Product $product)
    {
        $reviews = $product->reviews()
            ->with(['user:id,name'])
            ->where('is_visible', true)
            ->latest()
            ->paginate(10);

        return response()->json($reviews);
    }

    /**
     * Gửi đánh giá mới.
     */
    public function store(Request $request, Product $product)
    {
        $user = auth()->user();

        // 1. Kiểm tra xem người dùng đã mua sản phẩm này chưa và đơn hàng đã hoàn thành chưa
        $hasPurchased = Order::where('user_id', $user->id)
            ->whereIn('order_status', ['delivered', 'completed']) // Tùy vào trạng thái bạn định nghĩa
            ->whereHas('items', function ($query) use ($product) {
                $query->where('product_id', $product->id);
            })
            ->exists();

        if (!$hasPurchased) {
            return response()->json([
                'message' => 'Bạn chỉ có thể đánh giá sản phẩm sau khi đã mua hàng thành công.'
            ], 403);
        }

        // 2. Validate dữ liệu
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'content' => 'required|string|min:10',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048'
        ]);

        // 3. Xử lý upload ảnh (nếu có)
        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('reviews', 'public');
                $imagePaths[] = Storage::url($path);
            }
        }

        // 4. Lưu đánh giá
        $review = Review::create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'rating' => $request->rating,
            'content' => $request->content,
            'images' => $imagePaths,
            'status' => 'pending', // Mặc định chờ duyệt
        ]);

        return response()->json([
            'message' => 'Đánh giá của bạn đã được gửi và đang chờ quản trị viên phê duyệt.',
            'review' => $review
        ], 201);
    }
}
