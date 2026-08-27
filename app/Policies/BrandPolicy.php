<?php

namespace App\Policies;

use App\Models\Brand;
use App\Models\User;

class BrandPolicy
{
    /** Admin + Moderator xem được */
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->isModerator();
    }

    public function view(User $user, Brand $brand): bool
    {
        return $this->viewAny($user);
    }

    /** Chỉ Admin mới tạo/sửa/xóa thương hiệu */
    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, Brand $brand): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user, Brand $brand): bool
    {
        return $user->isAdmin();
    }
}
