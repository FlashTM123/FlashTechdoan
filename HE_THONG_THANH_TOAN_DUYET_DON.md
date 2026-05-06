# ⚡ Hệ thống Thanh toán & Truy vết Duyệt đơn (Payment & Audit Trail)

Tài liệu này hướng dẫn thiết kế kiến trúc hệ thống thanh toán chuyên nghiệp và cơ chế quản lý người duyệt đơn cho dự án FlashTech.

---

## 1. Tách hệ thống Thanh toán (Payment Methods)

### 📂 Migration: Bảng `payment_methods`
```php
// database/migrations/xxxx_create_payment_methods_table.php
Schema::create('payment_methods', function (Blueprint $table) {
    $table->id();
    $table->string('name'); // Ví dụ: Chuyển khoản ngân hàng, Ví MoMo, COD
    $table->string('code')->unique(); // vnpay, momo, cod
    $table->boolean('status')->default(true); // Hoạt động hoặc Bảo trì
    $table->timestamps();
});
```

### 📂 Migration: Cập nhật bảng `orders`
```php
// database/migrations/xxxx_add_payment_method_id_to_orders_table.php
Schema::table('orders', function (Blueprint $table) {
    $table->foreignId('payment_method_id')->constrained('payment_methods');
});
```

### 💡 Lợi ích kiến trúc
*   **Khả năng mở rộng (Scalability):** Khi muốn thêm phương thức thanh toán mới, bạn chỉ cần chèn 1 dòng vào database thay vì sửa code.
*   **Quản lý tập trung:** Dễ dàng bật/tắt (Disable) một phương thức thanh toán khi hệ thống đối tác bảo trì.

---

## 2. Hệ thống Người duyệt đơn (Order Processing)

### 📂 Migration: Thêm người duyệt vào `orders`
```php
Schema::table('orders', function (Blueprint $table) {
    // nullable vì đơn mới tạo chưa có người duyệt
    $table->foreignId('processed_by_id')->nullable()->constrained('users');
});
```

### 📂 Model Logic (`Order.php`)
Định nghĩa 2 quan hệ khác nhau nhưng cùng trỏ về một bảng `User`.

```php
// app/Models/Order.php
public function customer() {
    return $this->belongsTo(User::class, 'user_id');
}

public function processor() {
    return $this->belongsTo(User::class, 'processed_by_id');
}
```

### 📂 Controller Logic: Xử lý duyệt đơn
```php
// app/Http/Controllers/OrderController.php
public function approve(Order $order) {
    // Chặn không cho khách hàng tự duyệt đơn
    if (auth()->user()->role === 'customer') {
        abort(403, 'Bạn không có quyền thực hiện hành động này.');
    }

    $order->update([
        'status' => 'processing',
        'processed_by_id' => auth()->id(), // Tự động gán người đang đăng nhập
    ]);

    return back()->with('success', 'Đơn hàng đã được phê duyệt.');
}
```

---

## 3. Hiển thị Frontend (React 19 & Tailwind)

### 📂 Logic hiển thị Badge người duyệt
Sử dụng Tailwind để phân loại màu sắc theo vai trò (Role).

```tsx
// components/OrderProcessorInfo.tsx
const roleColors = {
    admin: 'bg-purple-100 text-purple-700 border-purple-200',
    moderator: 'bg-blue-100 text-blue-700 border-blue-200',
    employee: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

export default function OrderProcessorInfo({ order }: { order: any }) {
    if (!order.processor) {
        return (
            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-xl border border-amber-100">
                <span className="animate-pulse">●</span>
                <span className="text-sm font-bold uppercase tracking-wider">Đang chờ xử lý...</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500">
                {order.processor.name[0]}
            </div>
            <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Người duyệt</p>
                <div className="flex items-center gap-2 mt-1">
                    <span className="font-bold text-slate-900">{order.processor.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${roleColors[order.processor.role]}`}>
                        {order.processor.role}
                    </span>
                </div>
            </div>
        </div>
    );
}
```

---

## 🛡️ Nguyên tắc thiết kế (Dành cho báo cáo)
1.  **Separation of Concerns (Phân tách mối quan tâm):** Phương thức thanh toán được tách biệt khỏi đơn hàng để dễ quản lý.
2.  **Auditability (Tính có thể kiểm tra):** Mọi đơn hàng đều lưu vết người duyệt để phục vụ việc đối soát và quy trách nhiệm.
3.  **RBAC (Role-Based Access Control):** Kiểm soát hành động dựa trên vai trò, ngăn chặn các hành vi gian lận (Khách hàng tự duyệt đơn).
