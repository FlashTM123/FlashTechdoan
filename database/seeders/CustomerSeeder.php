<?php

namespace Database\Seeders;

use App\Models\Customer;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        $customers = [
            [
                'name' => 'Nguyễn Văn A',
                'email' => 'vana@gmail.com',
                'password' => Hash::make('12345678'),
                'phone' => '0912345678',
                'address' => '123 Nguyễn Trãi, Hà Nội',
                'points' => 150,
                'is_active' => true,
            ],
            [
                'name' => 'Trần Thị B',
                'email' => 'thib@gmail.com',
                'password' => Hash::make('12345678'),
                'phone' => '0987654321',
                'address' => '456 Lê Lợi, TP. HCM',
                'points' => 50,
                'is_active' => true,
            ],
            [
                'name' => 'Lê Văn C',
                'email' => 'vanc@gmail.com',
                'password' => Hash::make('12345678'),
                'phone' => '0905111222',
                'address' => '789 Hùng Vương, Đà Nẵng',
                'points' => 0,
                'is_active' => false,
            ],
            [
                'name' => 'Phạm Minh D',
                'email' => 'minhd@gmail.com',
                'password' => Hash::make('12345678'),
                'phone' => '0934555666',
                'address' => '101 Trần Hưng Đạo, Cần Thơ',
                'points' => 300,
                'is_active' => true,
            ],
            [
                'name' => 'Hoàng Thị E',
                'email' => 'thie@gmail.com',
                'password' => Hash::make('12345678'),
                'phone' => '0977888999',
                'address' => '202 Quang Trung, Hải Phòng',
                'points' => 20,
                'is_active' => true,
            ],
        ];

        foreach ($customers as $customer) {
            Customer::create($customer);
        }
    }
}

