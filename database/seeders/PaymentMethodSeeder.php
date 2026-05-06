<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PaymentMethodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\PaymentMethod::updateOrCreate(
            ['code' => 'cod'],
            ['name' => 'Thanh toán khi nhận hàng (COD)', 'status' => true]
        );

        \App\Models\PaymentMethod::updateOrCreate(
            ['code' => 'bank_transfer'],
            ['name' => 'Chuyển khoản ngân hàng', 'status' => true]
        );

        \App\Models\PaymentMethod::updateOrCreate(
            ['code' => 'momo'],
            ['name' => 'Ví điện tử MoMo', 'status' => true]
        );
    }
}
