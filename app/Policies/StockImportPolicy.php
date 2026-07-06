<?php

namespace App\Policies;

use App\Models\StockImport;
use App\Models\User;

class StockImportPolicy
{
    /** Admin + Moderator xem được */
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->isModerator();
    }

    public function view(User $user, StockImport $stockImport): bool
    {
        return $this->viewAny($user);
    }

    /** Admin + Moderator tạo phiếu nhập kho */
    public function create(User $user): bool
    {
        return $user->isAdmin() || $user->isModerator();
    }

    /** Chỉ Admin mới sửa phiếu nhập kho đã tạo */
    public function update(User $user, StockImport $stockImport): bool
    {
        return $user->isAdmin();
    }

    /** Chỉ Admin mới xóa phiếu nhập kho */
    public function delete(User $user, StockImport $stockImport): bool
    {
        return $user->isAdmin();
    }
}
