<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Chỉ Admin mới được xem danh sách và thực hiện các thao tác với User.
     */
    public function viewAny(User $user): bool
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
}
