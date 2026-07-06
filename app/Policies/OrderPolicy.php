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
     * Admin và Moderator mới được tạo đơn hàng thủ công.
     * Employee không tạo được đơn hàng.
     */
    public function create(User $user): bool
    {
        return $user->isAdmin() || $user->isModerator();
    }

    /**
     * Cả 3 vai trò đều được cập nhật trạng thái đơn hàng.
     */
    public function update(User $user, Order $order): bool
    {
        return $user->isAdmin() || $user->isModerator() || $user->isEmployee();
    }

    /**
     * Chỉ Admin mới được xóa đơn hàng.
     */
    public function delete(User $user, Order $order): bool
    {
        return $user->isAdmin();
    }

    public function forceDelete(User $user, Order $order): bool
    {
        return $user->isAdmin();
    }
}
