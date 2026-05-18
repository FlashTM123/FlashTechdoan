<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Lấy thông tin chi tiết của các sản phẩm để so sánh.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function compare(Request $request)
    {
        // Validate
        $validated = $request->validate([
            'product_ids' => 'required|array|min:1|max:3',
            'product_ids.*' => 'required|integer|exists:products,id',
        ], [
            'product_ids.required' => 'Vui lòng chọn sản phẩm để so sánh.',
            'product_ids.array' => 'Danh sách sản phẩm phải là mảng.',
            'product_ids.min' => 'Vui lòng chọn ít nhất 1 sản phẩm.',
            'product_ids.max' => 'Chỉ có thể so sánh tối đa 3 sản phẩm.',
            'product_ids.*.exists' => 'Một hoặc nhiều sản phẩm không tồn tại.',
        ]);

        // Query products with relations
        $products = Product::with([
            'variants.details',
            'variants.images',
            'brand',
            'category'
        ])
            ->whereIn('id', $validated['product_ids'])
            ->where('is_active', true)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'thumbnail_url' => $product->thumbnail_url,
                    'description' => $product->description,
                    'is_featured' => $product->is_featured,
                    'price' => $product->variants->min('price'), // Lowest variant price
                    'brand' => [
                        'id' => $product->brand?->id,
                        'name' => $product->brand?->name,
                    ],
                    'category' => [
                        'id' => $product->category?->id,
                        'name' => $product->category?->name,
                    ],
                    'variants' => $product->variants->map(function ($variant) {
                        return [
                            'id' => $variant->id,
                            'variant_name' => $variant->variant_name,
                            'price' => $variant->price,
                            'old_price' => $variant->old_price,
                            'stock' => $variant->stock,
                            'sku' => $variant->sku,
                            'images' => $variant->images->pluck('image_url')->toArray(),
                            'details' => $variant->details->reduce(function ($carry, $detail) {
                                $carry[strtolower($detail->attribute_name)] = $detail->attribute_value;
                                return $carry;
                            }, []),
                        ];
                    })->toArray(),
                ];
            });

        if ($products->isEmpty()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy sản phẩm để so sánh.',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $products,
        ], 200);
    }
}
