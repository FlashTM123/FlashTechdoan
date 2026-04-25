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

        // Kiểm tra xem user có tồn tại và đang bị khóa hay không
        if ($user && ! $user->is_active) {
            throw ValidationException::withMessages([
                'data.email' => 'Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.',
            ]);
        }

        // Nếu qua được bước trên thì chạy logic login bình thường của Filament
        return parent::authenticate();
    }
}
