<?php

namespace App\Filament\Pages\Auth;

use Filament\Auth\Pages\Login as BaseLogin;
use Illuminate\Validation\ValidationException;

class Login extends BaseLogin
{
    public function authenticate(): ?\Filament\Auth\Http\Responses\Contracts\LoginResponse
    {
        $data = $this->form->getState();
        $user = \App\Models\User::where('email', $data['email'])->first();

        // 1. Kiểm tra tài khoản bị khóa
        if ($user && ! $user->is_active) {
            throw ValidationException::withMessages([
                'data.email' => 'Tài khoản của bạn đã bị vô hiệu hóa.',
            ]);
        }

        // 2. Chặn khách hàng vào trang quản trị
        if ($user && $user->role === 'customer') {
            throw ValidationException::withMessages([
                'data.email' => 'Tài khoản khách hàng không thể đăng nhập tại đây.',
            ]);
        }

        return parent::authenticate();
    }

    protected function getCredentialsFromFormData(array $data): array
    {
        return [
            'email' => $data['email'],
            'password' => $data['password'],
            'is_active' => true,
        ];
    }
}
