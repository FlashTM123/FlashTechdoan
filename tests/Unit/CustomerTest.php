<?php

namespace Tests\Unit;
use App\Models\Customer;
use Tests\TestCase;
class CustomerTest extends TestCase
{
    /**
     * Test Case 1: Kiểm tra tên hợp lệ.
     * Một khách hàng phải trả về true khi tên không rỗng và có ít nhất 3 ký tự.
     */
    public function test_customer_name_is_valid(): void
    {
        // 1. Sắp đặt (Arrange): Tạo một đối tượng Customer giả lập trong bộ nhớ (không lưu DB)
        $customer = new Customer([
            'name' => 'John Doe',
            'email' => 'john.doe@example.com'
        ]);

        // 2. Thực thi (Act): Gọi phương thức cần kiểm tra
        $isValid = $customer->isValid();

        // 3. Kiểm tra (Assert): Xác minh kết quả
        $this->assertTrue($isValid);
    }
}
