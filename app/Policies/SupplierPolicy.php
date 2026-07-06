<?php

namespace App\Policies;

use App\Models\Supplier;
use App\Models\User;

class SupplierPolicy
{
    /** Admin + Moderator xem được */
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->isModerator();
    }

    public function view(User $user, Supplier $supplier): bool
    {
        return $this->viewAny($user);
    }

    /** Admin + Moderator tạo/sửa nhà cung cấp */
    public function create(User $user): bool
    {
        return $user->isAdmin() || $user->isModerator();
    }

    public function update(User $user, Supplier $supplier): bool
    {
        return $user->isAdmin() || $user->isModerator();
    }

    /** Chỉ Admin mới được xóa */
    public function delete(User $user, Supplier $supplier): bool
    {
        return $user->isAdmin();
    }
}
