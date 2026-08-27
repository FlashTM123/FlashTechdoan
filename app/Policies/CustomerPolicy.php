<?php

namespace App\Policies;

use App\Models\User;

/**
 * CustomerPolicy áp dụng cho CustomerResource (User có role = customer).
 * Vì CustomerResource dùng model User, cần override canViewAny riêng trong Resource.
 * Policy này được dùng cho các action trên record Customer.
 */
class CustomerPolicy
{
    /** Admin + Moderator xem được khách hàng */
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->isModerator();
    }

    public function view(User $user, User $model): bool
    {
        return $user->isAdmin() || $user->isModerator();
    }

    /** Chỉ Admin mới sửa thông tin khách hàng */
    public function update(User $user, User $model): bool
    {
        return $user->isAdmin();
    }

    /** Chỉ Admin mới xóa khách hàng */
    public function delete(User $user, User $model): bool
    {
        return $user->isAdmin();
    }

    public function forceDelete(User $user, User $model): bool
    {
        return $user->isAdmin();
    }
}
