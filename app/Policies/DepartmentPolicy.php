<?php

namespace App\Policies;

use App\Models\Department;
use App\Models\User;

class DepartmentPolicy
{
    /**
     * Chỉ Admin mới được phép xem danh sách phòng ban.
     */
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    /**
     * Chỉ Admin mới được phép xem chi tiết phòng ban.
     */
    public function view(User $user, Department $department): bool
    {
        return $user->isAdmin();
    }

    /**
     * Chỉ Admin mới được phép tạo phòng ban mới.
     */
    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    /**
     * Chỉ Admin mới được phép chỉnh sửa phòng ban.
     */
    public function update(User $user, Department $department): bool
    {
        return $user->isAdmin();
    }

    /**
     * Chỉ Admin mới được phép xóa phòng ban.
     */
    public function delete(User $user, Department $department): bool
    {
        return $user->isAdmin();
    }
}
