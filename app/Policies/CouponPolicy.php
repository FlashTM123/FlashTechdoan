<?php

namespace App\Policies;

use App\Models\Coupon;
use App\Models\User;

class CouponPolicy
{
    /** Admin + Moderator xem được mã giảm giá */
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->isModerator();
    }

    public function view(User $user, Coupon $coupon): bool
    {
        return $this->viewAny($user);
    }

    /** Admin + Moderator tạo/sửa mã giảm giá */
    public function create(User $user): bool
    {
        return $user->isAdmin() || $user->isModerator();
    }

    public function update(User $user, Coupon $coupon): bool
    {
        return $user->isAdmin() || $user->isModerator();
    }

    /** Chỉ Admin mới được xóa mã giảm giá */
    public function delete(User $user, Coupon $coupon): bool
    {
        return $user->isAdmin();
    }

    public function forceDelete(User $user, Coupon $coupon): bool
    {
        return $user->isAdmin();
    }
}
