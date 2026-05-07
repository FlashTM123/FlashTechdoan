<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = \App\Models\Product::with('variants')->get();

        foreach ($products as $product) {
            // 1. Tạo 1-2 ảnh chung cho sản phẩm (variant_id = null)
            \App\Models\ProductImage::create([
                'product_id' => $product->id,
                'product_variant_id' => null,
                'image_url' => "https://placehold.co/600x400?text=" . urlencode($product->name . " Main"),
                'display_order' => 0,
                'is_primary' => true,
            ]);

            // 2. Tạo ảnh riêng cho từng biến thể (nếu có)
            foreach ($product->variants as $variant) {
                \App\Models\ProductImage::create([
                    'product_id' => $product->id,
                    'product_variant_id' => $variant->id,
                    'image_url' => "https://placehold.co/600x400?text=" . urlencode($variant->variant_name),
                    'display_order' => 1,
                    'is_primary' => false,
                ]);
            }
        }
    }
}
