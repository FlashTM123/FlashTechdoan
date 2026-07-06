<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Chỉ Admin mới được xem và quản lý danh sách Staff/User.
     */
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    public function view(User $user, User $model): bool
    {
        return $user->isAdmin();
    }

    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, User $model): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user, User $model): bool
    {
        // Admin không được tự xóa chính mình
        return $user->isAdmin() && $user->id !== $model->id;
    }

    public function forceDelete(User $user, User $model): bool
    {
        return $user->isAdmin() && $user->id !== $model->id;
    }
}
