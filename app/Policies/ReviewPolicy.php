<?php

namespace App\Policies;

use App\Models\Review;
use App\Models\User;

class ReviewPolicy
{
    /** Admin + Moderator xem được danh sách đánh giá */
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->isModerator();
    }

    public function view(User $user, Review $review): bool
    {
        return $this->viewAny($user);
    }

    /** Admin + Moderator duyệt/sửa đánh giá */
    public function update(User $user, Review $review): bool
    {
        return $user->isAdmin() || $user->isModerator();
    }

    /** Chỉ Admin mới được xóa đánh giá */
    public function delete(User $user, Review $review): bool
    {
        return $user->isAdmin();
    }

    public function forceDelete(User $user, Review $review): bool
    {
        return $user->isAdmin();
    }
}
