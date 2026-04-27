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
        \App\Models\Brand::updateOrCreate(
            ['slug' => 'dell'],
            ['name' => 'Dell', 'is_active' => true]
        );

        // Gọi các Seeder còn lại
        $this->call([
            CategorySeeder::class,
            ProductSeeder::class,
        ]);
    }
}
