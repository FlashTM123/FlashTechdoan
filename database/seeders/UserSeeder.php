<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Tạo Admin
        // $admin = User::create([
        //     'name' => 'Administrator',
        //     'email' => 'admin@flashtech.com',
        //     'password' => Hash::make('password'),
        //     'role' => 'admin',
        //     'employee_code' => 'AD001',
        //     'is_active' => true,
        // ]);

        // 2. Tạo một số nhân viên mẫu
        User::create([
            'name' => 'Nguyễn Văn Nhân Viên',
            'email' => 'staff@flashtech.com',
            'password' => Hash::make('password'),
            'role' => 'employee',
            'employee_code' => 'NV001',
            'is_active' => true,
        ]);

        // 3. Tạo khách hàng mẫu (Customer)
        $customersData = [
            [
                'name' => 'Trần Khách Hàng',
                'email' => 'customer@gmail.com',
                'phone' => '0901234567',
                'address' => '123 Đường Lê Lợi, Quận 1, TP.HCM',
            ],
            [
                'name' => 'Lê Thị Mua Sắm',
                'email' => 'shopper@gmail.com',
                'phone' => '0988776655',
                'address' => '456 Đường CMT8, Quận 3, TP.HCM',
            ],
            [
                'name' => 'Phạm Văn Công Nghệ',
                'email' => 'techie@gmail.com',
                'phone' => '0333444555',
                'address' => '789 Đường Xa Lộ Hà Nội, TP. Thủ Đức',
            ],
        ];

        foreach ($customersData as $data) {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make('password'),
                'role' => 'customer',
                'is_active' => true,
            ]);

            // Tạo profile đi kèm
            $user->profile()->create([
                'phone' => $data['phone'],
                'address' => $data['address'],
                'points' => rand(10, 500),
            ]);
        }
    }
}
