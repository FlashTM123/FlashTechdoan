# Hướng dẫn Hợp nhất Hệ thống User (Admin + Customer) - FlashTech

Việc đưa tất cả người dùng vào cùng bảng `users` là một bước đi thông minh. Nó giúp bạn chỉ cần dùng **một Guard duy nhất (`web`)**, dễ dàng quản lý giỏ hàng dựa trên `auth()->user()`, và đồng bộ hóa hệ thống Token/Session.

---

## 1. Migration: Merge & Restructure

Hãy tạo một migration mới: `php artisan make:migration consolidate_user_system`

```php
public function up(): void
{
    // 1. Cập nhật bảng users: Thêm role 'customer'
    Schema::table('users', function (Blueprint $table) {
        // Lưu ý: Phải dùng change() và đã cài doctrine/dbal nếu là bản Laravel cũ
        // Với Laravel 10+, bạn có thể định nghĩa lại cột enum
        $table->enum('role', ['admin', 'moderator', 'employee', 'customer'])
              ->default('customer')->change();
    });

    // 2. Tạo bảng user_profiles cho các thông tin riêng của khách hàng
    Schema::create('user_profiles', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->string('phone')->nullable();
        $table->string('address')->nullable();
        $table->integer('points')->default(0);
        $table->timestamps();
    });

    // 3. Cập nhật bảng orders: customer_id -> user_id
    Schema::table('orders', function (Blueprint $table) {
        // Xóa khóa ngoại cũ trước khi đổi tên
        $table->dropForeign(['customer_id']);
        $table->renameColumn('customer_id', 'user_id');
        // Trỏ lại khóa ngoại về bảng users
        $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
    });

    // 4. Dọn dẹp: Xóa bảng cũ
    Schema::dropIfExists('customer_sessions');
    Schema::dropIfExists('customers');
}
```

---

## 2. Model Relationship (User.php)

Trong Model `User`, bạn cần khai báo để phân biệt khi nào User là **Người mua** và khi nào là **Người duyệt**.

```php
// App\Models\User.php

// 1. Quan hệ với Profile
public function profile() {
    return $this->hasOne(UserProfile::class);
}

// 2. Với tư cách là Khách hàng (Người đặt hàng)
public function orders() {
    return $this->hasMany(Order::class, 'user_id');
}

// 3. Với tư cách là Nhân viên (Người duyệt đơn - từ cột processed_by_id trong orders)
public function processedOrders() {
    return $this->hasMany(Order::class, 'processed_by_id');
}

// Helper để check quyền nhanh
public function isCustomer() { return $this->role === 'customer'; }
public function isAdmin() { return $this->role === 'admin'; }
```

---

## 3. Tùy biến Laravel Breeze Register

Khi khách hàng đăng ký, chúng ta cần gán role `customer` mặc định và tạo profile.

Mở `app/Http/Controllers/Auth/RegisteredUserController.php`:

```php
public function store(Request $request): RedirectResponse
{
    $request->validate([
        'name' => ['required', 'string', 'max-255'],
        'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
        'password' => ['required', 'confirmed', Rules\Password::defaults()],
    ]);

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
        'role' => 'customer', // Luôn mặc định là customer khi đăng ký ngoài web
    ]);

    // Tạo profile trống cho user mới
    $user->profile()->create([
        'points' => 0
    ]);

    event(new Registered($user));
    Auth::login($user);

    return redirect(route('dashboard', absolute: false));
}
```

---

## 4. Tại sao nên dùng chung một bảng Users?

1.  **Dễ dàng quản lý Giỏ hàng (Cart)**: Bạn có thể lưu giỏ hàng vào Database gắn trực tiếp với `user_id`. Khi người dùng đăng nhập ở bất cứ đâu, giỏ hàng sẽ tự động xuất hiện mà không cần lo lắng về việc chuyển dữ liệu từ `customer` sang `user`.
2.  **Một Guard Duy Nhất**: Bạn không cần phải cấu hình `auth:admin` và `auth:customer` riêng biệt trong Middleware. Chỉ cần `auth` và sau đó check `if ($user->role === 'admin')`.
3.  **Hệ thống Profile linh hoạt**: Dùng `user_profiles` giúp bảng `users` chính luôn nhẹ nhàng. Thông tin nhân viên (mã NV, phòng ban) và thông tin khách hàng (điểm thưởng, địa chỉ) được tách biệt nhưng vẫn chung một gốc quản lý.
4.  **Thống kê & Báo cáo**: Bạn dễ dàng truy vấn các bảng như `reviews`, `comments` vì tất cả đều trỏ về một bảng `users` duy nhất.

> [!TIP]
> Đừng quên chạy `php artisan migrate` sau khi tạo file migration để áp dụng thay đổi!
