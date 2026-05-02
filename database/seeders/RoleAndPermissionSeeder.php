<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RoleAndPermissionSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Xóa cache của Spatie (luôn cần khi seeding quyền)
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // 2. Tạo các Role
        $adminRole    = Role::firstOrCreate(['name' => 'admin']);
        $moderatorRole = Role::firstOrCreate(['name' => 'moderator']);
        $employeeRole  = Role::firstOrCreate(['name' => 'employee']);

        // 3. (Tùy chọn) Tạo các Permission cụ thể nếu bạn muốn kiểm soát sâu hơn
        // Ví dụ: Permission::create(['name' => 'edit articles']);

        // 4. Gán Role cho tài khoản Admin chính
        $admin = User::where('email', 'admin@flashtech.com')->first();
        if ($admin) {
            $admin->assignRole($adminRole);
        }

        // Tạo thêm 1 Employee mẫu để test
        $employee = User::firstOrCreate(
            ['email' => 'staff@flashtech.com'],
            [
                'name' => 'Staff Member',
                'password' => bcrypt('password'),
            ]
        );
        $employee->assignRole($employeeRole);
    }
}
