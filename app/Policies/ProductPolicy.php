<?php

namespace App\Policies;

use App\Models\Product;
use App\Models\User;

class ProductPolicy
{
    /** Admin + Moderator xem danh sách sản phẩm */
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->isModerator();
    }

    public function view(User $user, Product $product): bool
    {
        return $this->viewAny($user);
    }

    /** Admin + Moderator tạo sản phẩm */
    public function create(User $user): bool
    {
        return $user->isAdmin() || $user->isModerator();
    }

    /** Admin + Moderator sửa sản phẩm */
    public function update(User $user, Product $product): bool
    {
        return $user->isAdmin() || $user->isModerator();
    }

    /** Chỉ Admin mới được xóa sản phẩm */
    public function delete(User $user, Product $product): bool
    {
        return $user->isAdmin();
    }

    public function forceDelete(User $user, Product $product): bool
    {
        return $user->isAdmin();
    }
}
