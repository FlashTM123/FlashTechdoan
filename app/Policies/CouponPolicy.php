<?php

namespace App\Policies;

use App\Models\Coupon;
use App\Models\User;

class CouponPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->isModerator() || $user->isEmployee();
    }

    public function view(User $user, Coupon $coupon): bool
    {
        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        return $user->isAdmin() || $user->isModerator();
    }

    public function update(User $user, Coupon $coupon): bool
    {
        return $user->isAdmin() || $user->isModerator();
    }

    public function delete(User $user, Coupon $coupon): bool
    {
        return $user->isAdmin() || $user->isModerator();
    }
}
