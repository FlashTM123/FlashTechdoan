<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories =[
            'Laptop Gaming',
            'Laptop Văn Phòng',
            'Laptop Đồ Họa',
            'Macbook',
            'Linh kiện PC',
            'Phụ kiện',
        ];
        foreach ($categories as $category) {
            \App\Models\Category::create([
                'name' => $category,
                'slug' => \Illuminate\Support\Str::slug($category),
                'is_active' => true,
            ]);
        }
    }
}
