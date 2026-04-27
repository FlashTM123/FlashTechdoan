<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductSpec;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $product = Product::create([
            'category_id' => 1,
            'brand_id' => 1,
            'name' => 'Dell Gaming G15 5530',
            'slug' => 'dell-gaming-g15-5530',
            'thumbnail_url' => 'https://via.placeholder.com/150',
            'description' => '<p>Dòng Gaming bán chạy nhất của Dell.</p>',
            'is_featured' => true,
        ]);

        // Tạo 2 Biến thể
        $product->variants()->createMany([
            [
                'variant_name' => 'Core i5/8GB/512GB',
                'color' => 'Dark Shadow Gray',
                'price' => 18000000,
                'old_price' => 22000000,
                'stock' => 15,
                'sku' => 'DELL-G15-I5-01',
            ],
            [
                'variant_name' => 'Core i7/16GB/512GB',
                'color' => 'Dark Shadow Gray',
                'price' => 24000000,
                'old_price' => 28000000,
                'stock' => 10,
                'sku' => 'DELL-G15-I7-02',
            ]
        ]);

        // Tạo Specs MongoDB
        ProductSpec::create([
            'product_id' => $product->id,
            'specifications' => [
                ['key' => 'Màn hình', 'value' => '15.6 inch FHD 120Hz'],
                ['key' => 'VGA', 'value' => 'RTX 3050 6GB'],
                ['key' => 'Trọng lượng', 'value' => '2.81 kg'],
            ]
        ]);
    }
}

