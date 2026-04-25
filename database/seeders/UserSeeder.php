<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1 Admin
        User::create([
            'name' => 'Quản trị viên',
            'email' => 'admin@flashtech.local',
            'password' => Hash::make('password123'),
            'employee_code' => 'ADM001',
            'department' => 'Quản lý',
            'role' => 'admin',
            'is_active' => true,
        ]);

        // 1 Moderator
        User::create([
            'name' => 'Người kiểm duyệt',
            'email' => 'moderator@flashtech.local',
            'password' => Hash::make('password123'),
            'employee_code' => 'MOD001',
            'department' => 'Hỗ trợ',
            'role' => 'moderator',
            'is_active' => true,
        ]);

        // 2 Employees
        User::create([
            'name' => 'Nhân viên 1',
            'email' => 'employee1@flashtech.local',
            'password' => Hash::make('password123'),
            'employee_code' => 'EMP001',
            'department' => 'Bán hàng',
            'role' => 'employee',
            'is_active' => true,
        ]);

        User::create([
            'name' => 'Nhân viên 2',
            'email' => 'employee2@flashtech.local',
            'password' => Hash::make('password123'),
            'employee_code' => 'EMP002',
            'department' => 'Kỹ thuật',
            'role' => 'employee',
            'is_active' => true,
        ]);
    }
}
