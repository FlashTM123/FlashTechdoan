<?php

namespace App\Policies;

use App\Models\Review;
use App\Models\User;

class ReviewPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->isModerator() || $user->isEmployee();
    }

    public function view(User $user, Review $review): bool
    {
        return $this->viewAny($user);
    }

    public function update(User $user, Review $review): bool
    {
        return $user->isAdmin() || $user->isModerator();
    }

    public function delete(User $user, Review $review): bool
    {
        return $user->isAdmin() || $user->isModerator();
    }
}
