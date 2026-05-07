# Hướng dẫn Cấu hình Dữ liệu và Cập nhật Giao diện Đơn hàng

Tài liệu này hướng dẫn bạn cách thiết lập Seeder cho phương thức thanh toán, đơn hàng mẫu và cập nhật giao diện Admin để hiển thị thông tin người duyệt đơn hàng.

## 1. Tạo PaymentMethodSeeder

Cập nhật file `database/seeders/PaymentMethodSeeder.php` để khởi tạo các phương thức thanh toán mặc định:

```php
<?php

namespace Database\Seeders;

use App\Models\PaymentMethod;
use Illuminate\Database\Seeder;

class PaymentMethodSeeder extends Seeder
{
    public function run(): void
    {
        $methods = [
            [
                'name' => 'Thanh toán khi nhận hàng (COD)',
                'code' => 'cod',
                'status' => true
            ],
            [
                'name' => 'Chuyển khoản ngân hàng',
                'code' => 'bank_transfer',
                'status' => true
            ],
            [
                'name' => 'Ví điện tử Momo',
                'code' => 'momo',
                'status' => true
            ],
        ];

        foreach ($methods as $method) {
            PaymentMethod::updateOrCreate(
                ['code' => $method['code']],
                $method
            );
        }
    }
}
```

## 2. Tạo OrderSeeder (Dữ liệu mẫu)

Cập nhật file `database/seeders/OrderSeeder.php`. Đoạn code này sẽ tạo đơn hàng mới với trạng thái `pending` và chưa có người duyệt (`processed_by_id` là `null`).

```php
<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\Customer;
use App\Models\PaymentMethod;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $customers = Customer::all();
        $paymentMethods = PaymentMethod::where('status', true)->get();

        if ($customers->isEmpty() || $paymentMethods->isEmpty()) {
            $this->command->warn('Vui lòng tạo Customer và PaymentMethod trước!');
            return;
        }

        foreach (range(1, 10) as $index) {
            Order::create([
                'customer_id'       => $customers->random()->id,
                'order_code'        => 'FT-' . strtoupper(Str::random(8)),
                'total_amount'      => rand(500000, 20000000),
                'shipping_address'  => 'Địa chỉ mẫu số ' . $index,
                'payment_method_id' => $paymentMethods->random()->id, // Lấy ID ngẫu nhiên
                'payment_status'    => 'pending',
                'order_status'      => 'pending', // Giả lập đơn hàng mới
                'processed_by_id'   => null,      // Đang chờ duyệt
                'notes'             => 'Đơn hàng thử nghiệm ' . $index,
            ]);
        }
    }
}
```

## 3. Cập nhật giao diện Admin (React 19)

Trong component hiển thị danh sách đơn hàng (ví dụ: `OrderList.tsx`), sử dụng logic sau để render cột "Người duyệt".

### Code mẫu Logic hiển thị:

```tsx
import { Badge } from "@/Components/ui/badge"; // Giả sử bạn dùng Shadcn/UI hoặc component tương tự

// ... trong hàm render bảng
{orders.map((order) => (
    <tr key={order.id}>
        {/* ... các cột khác */}
        <td className="px-6 py-4">
            {order.processed_by_id === null ? (
                <Badge variant="outline" className="bg-gray-100 text-gray-500 border-gray-300">
                    <span className="w-2 h-2 rounded-full bg-gray-400 mr-2"></span>
                    Chờ duyệt
                </Badge>
            ) : (
                <div className="flex flex-col gap-1">
                    <span className="font-medium text-sm text-gray-900">
                        {order.processor?.name}
                    </span>
                    <Badge className={getRoleBadgeColor(order.processor?.role)}>
                        {order.processor?.role?.toUpperCase()}
                    </Badge>
                </div>
            )}
        </td>
    </tr>
))}

// Hàm helper để map màu sắc vai trò
const getRoleBadgeColor = (role: string) => {
    switch (role) {
        case 'admin': return 'bg-red-100 text-red-700 border-red-200';
        case 'moderator': return 'bg-blue-100 text-blue-700 border-blue-200';
        case 'employee': return 'bg-green-100 text-green-700 border-green-200';
        default: return 'bg-gray-100 text-gray-700';
    }
};
```

## 4. Câu lệnh thực thi

Để mọi thứ hoạt động trơn tru, bạn nên đăng ký các Seeder vào `DatabaseSeeder.php`:

```php
// database/seeders/DatabaseSeeder.php
public function run(): void
{
    $this->call([
        UserSeeder::class,
        CustomerSeeder::class,
        PaymentMethodSeeder::class, // Thêm dòng này trước OrderSeeder
        CategorySeeder::class,
        BrandSeeder::class,
        ProductSeeder::class,
        ReviewSeeder::class,
        OrderSeeder::class,
    ]);
}
```

Sau đó chạy lệnh:

```bash
php artisan db:seed
```

---

## Giải thích: Tránh lỗi "Trying to get property of non-object"

Khi cột `processed_by_id` là `null`, quan hệ `$order->processor` trong Eloquent sẽ trả về `null`. Nếu bạn cố gắng truy cập `$order->processor->name`, Laravel sẽ báo lỗi ngay lập tức.

**Cách xử lý an toàn:**

1.  **Sử dụng Null Coalescing hoặc Optional Chaining (PHP 8.0+):**
    ```php
    // Trả về tên hoặc chuỗi 'Chờ duyệt' nếu processor là null
    $name = $order->processor?->name ?? 'Chờ duyệt';
    ```

2.  **Sử dụng hàm `optional()`:**
    ```php
    $name = optional($order->processor)->name ?? 'Chờ duyệt';
    ```

3.  **Kiểm tra null trước khi render (Trong Blade hoặc React):**
    Như trong đoạn code React ở trên, chúng ta dùng `order.processed_by_id === null` để rẽ nhánh UI trước khi chạm vào object `processor`.

4.  **Eager Loading:**
    Đảm bảo trong Controller bạn đã load quan hệ để tránh lỗi N+1 và giúp frontend có sẵn dữ liệu:
    ```php
    $orders = Order::with(['processor', 'paymentMethod'])->get();
    ```
