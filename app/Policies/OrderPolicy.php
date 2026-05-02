<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;

class OrderPolicy
{
    /**
     * Admin, Moderator và Employee đều xem được danh sách đơn hàng.
     */
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->isModerator() || $user->isEmployee();
    }

    public function view(User $user, Order $order): bool
    {
        return $this->viewAny($user);
    }

    /**
     * Cả 3 vai trò đều được cập nhật đơn hàng (đổi trạng thái).
     */
    public function update(User $user, Order $order): bool
    {
        return $this->viewAny($user);
    }

    /**
     * Chỉ Admin và Moderator mới được xóa đơn hàng.
     */
    public function delete(User $user, Order $order): bool
    {
        return $user->isAdmin() || $user->isModerator();
    }
}
