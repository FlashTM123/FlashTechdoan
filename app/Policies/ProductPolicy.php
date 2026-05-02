<?php

namespace App\Policies;

use App\Models\Product;
use App\Models\User;

class ProductPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->isModerator() || $user->isEmployee();
    }

    public function view(User $user, Product $product): bool
    {
        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        return $user->isAdmin() || $user->isModerator();
    }

    public function update(User $user, Product $product): bool
    {
        return $user->isAdmin() || $user->isModerator();
    }

    public function delete(User $user, Product $product): bool
    {
        return $user->isAdmin() || $user->isModerator();
    }
}
