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
        // Tạo Brand mẫu để không bị lỗi khóa ngoại


        // Gọi các Seeder còn lại
        $this->call([
            UserSeeder::class,
            CustomerSeeder::class,
            CategorySeeder::class,
            BrandSeeder::class,
            ProductSeeder::class,
            ReviewSeeder::class,
            OrderSeeder::class,
        ]);
    }
}
