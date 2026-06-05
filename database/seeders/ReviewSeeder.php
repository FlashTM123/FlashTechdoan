<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Review;
use App\Models\User;
use App\Models\Product;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $customers = User::where('role', 'customer')->get();
        $products = Product::all();
        if ($customers->isEmpty() || $products->isEmpty()) {
            return;
        }
        $sampleComments = [
            'Sản phẩm dùng rất tốt, máy chạy êm và mượt.',
            'Giá hơi đắt nhưng chất lượng hoàn thiện tuyệt vời.',
            'Giao hàng nhanh, đóng gói cẩn thận. Tư vấn nhiệt tình.',
            'Chơi game rất mát, không bị drop fps. Ưng ý!',
            'Pin hơi yếu một chút nhưng sạc nhanh bù lại.',
        ];
        foreach ($products as $product) {
            // Mỗi sản phẩm có từ 1 đến 3 đánh giá ngẫu nhiên
            $reviewCount = rand(1, 3);
            
            for ($i = 0; $i < $reviewCount; $i++) {
                Review::create([
                    'user_id' => $customers->random()->id,
                    'product_id' => $product->id,
                    'rating' => rand(4, 5), // Sản phẩm thường có đánh giá tốt
                    'content' => $sampleComments[array_rand($sampleComments)],
                    'is_visible' => true,
                ]);
            }
        }
    }
}
