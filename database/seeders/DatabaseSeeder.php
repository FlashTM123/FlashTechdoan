<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Gọi các Seeder theo thứ tự để không lỗi khóa ngoại
        $this->call([
            UserSeeder::class,          // 1. Tạo admin + khách hàng mẫu
            CategorySeeder::class,      // 2. Danh mục (không phụ thuộc)
            BrandSeeder::class,         // 3. Thương hiệu (không phụ thuộc)
            PaymentMethodSeeder::class, // 4. Phương thức thanh toán (cần cho Checkout)
            ProductSeeder::class,       // 5. Sản phẩm (cần category + brand)
            ProductImageSeeder::class,  // 6. Ảnh sản phẩm (cần product)
            OrderSeeder::class,         // 7. Đơn hàng mẫu (cần user + product)
            ReviewSeeder::class,        // 8. Đánh giá (cần user + product + order)
        ]);
    }
}
