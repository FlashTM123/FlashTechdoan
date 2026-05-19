<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductVariant;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Lấy thông tin chi tiết của các biến thể sản phẩm để so sánh.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function compare(Request $request)
    {
        // Validate
        $validated = $request->validate([
            'variant_ids' => 'required|array|min:1|max:3',
            'variant_ids.*' => 'required|integer|exists:product_variants,id',
        ], [
            'variant_ids.required' => 'Vui lòng chọn sản phẩm để so sánh.',
            'variant_ids.array' => 'Danh sách sản phẩm phải là mảng.',
            'variant_ids.min' => 'Vui lòng chọn ít nhất 1 sản phẩm.',
            'variant_ids.max' => 'Chỉ có thể so sánh tối đa 3 sản phẩm.',
            'variant_ids.*.exists' => 'Một hoặc nhiều sản phẩm không tồn tại.',
        ]);

        // Query variants with relations
        $variants = ProductVariant::with([
            'product.brand',
            'product.category',
            'details',
            'images'
        ])
            ->whereIn('id', $validated['variant_ids'])
            ->whereHas('product', function ($query) {
                $query->where('is_active', true);
            })
            ->get();

        if ($variants->isEmpty()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy sản phẩm để so sánh.',
            ], 404);
        }

        // Flatten variants - each variant becomes its own comparison item
        $products = $variants->map(function ($variant) {
            $product = $variant->product;

            return [
                'id' => $variant->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'thumbnail_url' => $product->thumbnail_url,
                'description' => $product->description,
                'is_featured' => $product->is_featured,
                'price' => $variant->price,
                'brand' => [
                    'id' => $product->brand?->id,
                    'name' => $product->brand?->name,
                ],
                'category' => [
                    'id' => $product->category?->id,
                    'name' => $product->category?->name,
                ],
                'variants' => [[
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
                ]],
            ];
        })->values();

        return response()->json([
            'status' => 'success',
            'data' => $products,
        ], 200);
    }
}
