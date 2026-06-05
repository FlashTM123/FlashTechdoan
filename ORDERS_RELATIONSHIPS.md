# 📋 Hướng Dẫn Cấu Hình Orders với 2 Relationships tới User

## 🎯 Mô Tả Cấu Trúc

Bảng `orders` của bạn có **2 khóa ngoại độc lập trỏ về `users.id`**:

| Trường | Ý Nghĩa | Type | Ghi Chú |
|--------|---------|------|--------|
| `user_id` | Khách hàng đặt mua đơn hàng | Foreign Key | NOT NULL |
| `processed_by_id` | Admin/Nhân viên duyệt xử lý | Foreign Key | **Nullable** |

---

## 1️⃣ Model Order.php - Cấu Hình Relationships

### ✅ Đã Cấu Hình Đầy Đủ

```php
// Mối quan hệ đến User (Khách hàng đặt mua)
public function user(): BelongsTo
{
    return $this->belongsTo(User::class, 'user_id');
}

// Mối quan hệ đến User (Nhân viên/Admin xử lý)
public function processor(): BelongsTo
{
    return $this->belongsTo(User::class, 'processed_by_id');
}

// Mối quan hệ đến Coupon (Mã giảm giá)
public function coupon(): BelongsTo
{
    return $this->belongsTo(Coupon::class);
}
```

### 📌 Cách Sử Dụng Trong Code

```php
// 1. Lấy khách hàng của đơn hàng
$order = Order::find(1);
$customer = $order->user;  // User object
echo $customer->name;      // "Nguyễn Văn A"

// 2. Lấy nhân viên xử lý (có thể null!)
$processor = $order->processor;  // User object hoặc null
echo $processor?->name;          // "Trần Thị B" hoặc null

// 3. Sử dụng Eager Loading (tối ưu query)
$orders = Order::with(['user', 'processor', 'coupon'])->get();

// 4. Nullable Chaining (an toàn khi processor là null)
$processorName = $order->processor?->name ?? 'Chưa xử lý';
```

---

## 2️⃣ OrderController API - Endpoints Admin

### 📍 Tệp: `app/Http/Controllers/Api/Admin/OrderController.php`

#### **GET /api/admin/orders** - Danh Sách Orders

**Response JSON:**
```json
{
  "success": true,
  "message": "Danh sách đơn hàng",
  "data": [
    {
      "id": 1,
      "order_code": "ORD-2024-001",
      "order_status": "pending",
      "payment_status": "unpaid",
      "total_amount": 450000,
      "discount_amount": 50000,
      "created_at": "2024-05-20T10:30:00Z",
      "user": {
        "id": 5,
        "name": "Nguyễn Văn A",
        "email": "customer@example.com",
        "phone": "0901234567"
      },
      "processor": {
        "id": 2,
        "name": "Trần Thị B",
        "email": "admin@example.com",
        "role": "admin"
      }
    }
  ],
  "pagination": { ... }
}
```

#### **GET /api/admin/orders/{id}** - Chi Tiết Order

**Response JSON:**
```json
{
  "success": true,
  "message": "Chi tiết đơn hàng",
  "data": {
    "order": {
      "id": 1,
      "order_code": "ORD-2024-001",
      "order_status": "pending",
      "payment_status": "unpaid",
      "total_amount": 450000,
      "original_amount": 500000,
      "discount_amount": 50000,
      "shipping_address": "123 Đường ABC, Hà Nội",
      "notes": "Giao nhanh",
      "created_at": "2024-05-20T10:30:00Z"
    },
    "customer": {
      "id": 5,
      "name": "Nguyễn Văn A",
      "email": "customer@example.com",
      "phone": "0901234567",
      "role": "customer"
    },
    "processor": {
      "id": 2,
      "name": "Trần Thị B",
      "email": "admin@example.com",
      "employee_code": "NV001",
      "role": "admin"
    },
    "payment_method": {
      "id": 1,
      "name": "VNPAY"
    },
    "coupon": {
      "id": 3,
      "code": "SUMMER20",
      "type": "percent",
      "value": 20
    },
    "items": [
      {
        "id": 1,
        "product": {
          "id": 10,
          "name": "Laptop Dell XPS",
          "slug": "laptop-dell-xps"
        },
        "variant": {
          "id": 25,
          "sku": "DEL-XPS-SLV-512GB",
          "size": null,
          "color": "Silver",
          "price": 450000
        },
        "quantity": 1,
        "unit_price": 450000,
        "subtotal": 450000
      }
    ]
  }
}
```

---

## 3️⃣ Xử Lý Trường Hợp `processed_by_id` = NULL

### ✅ Được Xử Lý An Toàn

```php
// Trong OrderController show()
'processor' => $order->processor ? [
    'id' => $order->processor->id,
    'name' => $order->processor->name,
    ...
] : null,  // ← Trả về null nếu chưa ai xử lý
```

### 🎯 Kết Quả Khi processor = null:
```json
{
  "data": {
    "processor": null,  // ← Không crash, trả về null
    "order": { ... },
    "items": [ ... ]
  }
}
```

---

## 4️⃣ Cách Sử Dụng Trong React Frontend

### Hiển Thị Bảng Orders

```jsx
// Lấy dữ liệu từ API
const { data } = await fetch('/api/admin/orders').then(r => r.json());

// Render bảng
<table>
  <tbody>
    {data.map(order => (
      <tr key={order.id}>
        <td>{order.order_code}</td>
        <td>{order.user.name}</td>
        <td>{order.processor?.name || 'Chưa xử lý'}</td>
        <td>{order.total_amount}</td>
        <td>{order.order_status}</td>
      </tr>
    ))}
  </tbody>
</table>
```

### Hiển Thị Chi Tiết Order

```jsx
const { data } = await fetch(`/api/admin/orders/${orderId}`).then(r => r.json());
const { order, customer, processor, coupon, items } = data.data;

return (
  <div>
    <h2>{order.order_code}</h2>
    
    <div>
      <strong>Khách hàng:</strong> {customer.name} ({customer.email})
    </div>
    
    <div>
      <strong>Xử lý bởi:</strong> 
      {processor ? `${processor.name} (${processor.role})` : 'Chưa xử lý'}
    </div>
    
    <div>
      <strong>Mã giảm giá:</strong> {coupon?.code || 'Không có'}
    </div>
    
    <table>
      <tbody>
        {items.map(item => (
          <tr key={item.id}>
            <td>{item.product.name}</td>
            <td>{item.quantity}</td>
            <td>{item.unit_price}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
```

---

## 5️⃣ Kiểm Tra Eager Loading

### ✅ Tối Ưu (Chỉ 4-5 queries)
```php
$orders = Order::with(['user', 'processor', 'coupon', 'items.product'])->get();
```

### ❌ Không Tối Ưu (N+1 query problem)
```php
$orders = Order::get();
foreach ($orders as $order) {
    $user = $order->user;      // 1 query mỗi order
    $processor = $order->processor;  // 1 query mỗi order
}
```

---

## 6️⃣ Routes API

```bash
# Danh sách orders
GET /api/admin/orders

# Chi tiết order
GET /api/admin/orders/{id}
```

**Yêu cầu:** 
- Header: `Authorization: Bearer {token}`
- User phải có role = `admin`

---

## 📚 Tóm Tắt

| Hành động | Code | Kết quả |
|-----------|------|--------|
| Lấy khách hàng | `$order->user` | User object (NOT NULL) |
| Lấy nhân viên xử lý | `$order->processor` | User object hoặc NULL |
| Nullable chaining | `$order->processor?->name` | Tên hoặc null (an toàn) |
| Eager loading | `with(['user', 'processor'])` | Tối ưu query |
| JSON response | `api/admin/orders/{id}` | Trả về processor = null nếu chưa xử lý |

---

✨ **Bây giờ Frontend của bạn có thể dễ dàng mapping dữ liệu để hiển thị bảng Orders!**
