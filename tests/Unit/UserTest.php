<?php

namespace Tests\Unit;

use App\Models\User;
use Tests\TestCase;
use Illuminate\Support\Carbon;

class UserTest extends TestCase
{
    /**
     * Test Case 1: Kiểm tra người dùng hợp lệ.
     * Một người dùng phải trả về true khi: is_active = true và chưa hết hạn.
     */
    public function test_user_is_valid_when_active_and_not_expired(): void
    {
        // 1. Sắp đặt (Arrange): Tạo một đối tượng User giả lập trong bộ nhớ (không lưu DB)
        $user = new User([
            'name' => 'Quản trị viên',
            'email' => 'admin@flashTech.local',
            'is_active' => true,
            'expires_at' => Carbon::now()->addDays(1), // Hết hạn
        ]);
        // 2. Thực thi (Act): Gọi hàm isValid()
        $result = $user->isValid();
        // 3. Khẳng định (Assert): Kết quả phải là true
        $this->assertTrue($result, 'Người dùng còn hạn và đang active phải
    hợp lệ.');
    }
}
