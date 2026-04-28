<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Review;
use App\Models\Customer;
use App\Models\Product;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $customers = Customer::all();
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
        for ($i = 0; $i < 10; $i++) {
            Review::create([
                'customer_id' => $customers->random()->id,
                'product_id' => $products->random()->id,
                'rating' => rand(3, 5), // Tạo ngẫu nhiên từ 3 đến 5 sao
                'content' => $sampleComments[array_rand($sampleComments)],
                'is_visible' => (bool)rand(0, 1), // Ngẫu nhiên ẩn/hiện
            ]);
        }
    }
}
