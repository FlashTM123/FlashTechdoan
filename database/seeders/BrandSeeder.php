<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BrandSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $brands = [
            ['name' => 'Dell', 'slug' => 'dell', 'logo_url' => 'https://via.placeholder.com/100x50?text=Dell'],
            ['name' => 'HP', 'slug' => 'hp', 'logo_url' => 'https://via.placeholder.com/100x50?text=HP'],
            ['name' => 'Asus', 'slug' => 'asus', 'logo_url' => 'https://via.placeholder.com/100x50?text=Asus'],
            ['name' => 'Lenovo', 'slug' => 'lenovo', 'logo_url' => 'https://via.placeholder.com/100x50?text=Lenovo'],
            ['name' => 'Acer', 'slug' => 'acer', 'logo_url' => 'https://via.placeholder.com/100x50?text=Acer'],
        ];

        foreach ($brands as $brand) {
            \App\Models\Brand::create($brand);
        }
    }
}
