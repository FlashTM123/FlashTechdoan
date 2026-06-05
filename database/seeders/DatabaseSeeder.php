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


        // Gọi các Seeder theo thứ tự để không lỗi khóa ngoại
        $this->call([
            // UserSeeder::class,
            // CategorySeeder::class,
            // BrandSeeder::class,
            // ProductSeeder::class,
            ReviewSeeder::class,
            // OrderSeeder::class,
        ]);
    }
}
