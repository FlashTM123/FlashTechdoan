# Hướng dẫn Tích hợp Auth (Laravel Breeze) với Hệ thống Hợp nhất - FlashTech

Tài liệu này hướng dẫn bạn cách tùy biến Laravel Breeze để hoạt động mượt mà với Database `users` đã hợp nhất và giao diện Premium của bạn.

---

## 1. User Profile Logic (Đăng ký)

Khi một khách hàng đăng ký, chúng ta cần gán role và tạo Profile ngay lập tức.

**File:** `app/Http/Controllers/Auth/RegisteredUserController.php`

```php
public function store(Request $request): RedirectResponse
{
    // ... validate dữ liệu ...

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
        'role' => 'customer', // Gán role khách hàng
    ]);

    // Tự động tạo bản ghi Profile đi kèm
    $user->profile()->create([
        'points' => 0,
        // phone và address để trống để khách cập nhật sau
    ]);

    event(new Registered($user));
    Auth::login($user);

    return redirect(route('home')); // Chuyển về trang chủ
}
```

---

## 2. Login Redirect (Phân quyền chuyển hướng)

Tùy vào Role mà sau khi đăng nhập User sẽ vào trang Admin hoặc trang chủ.

**File:** `app/Http/Controllers/Auth/AuthenticatedSessionController.php`

```php
public function store(LoginRequest $request): RedirectResponse
{
    $request->authenticate();
    $request->session()->regenerate();

    $user = Auth::user();

    // Phân quyền chuyển hướng
    if ($user->role === 'admin' || $user->role === 'moderator') {
        return redirect()->intended('/admin'); // Vào trang quản trị Filament
    }

    return redirect()->intended('/'); // Khách hàng về trang chủ
}
```

---

## 3. Dark Mode UI cho Breeze Components

Để các trang Login/Register không bị "lạc quẻ" với giao diện Premium của bạn, hãy sửa các component cơ bản của Breeze.

**Ví dụ sửa file:** `resources/js/Components/PrimaryButton.tsx`

```tsx
export default function PrimaryButton({ className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            disabled={disabled}
            className={
                `inline-flex items-center px-8 py-4 bg-indigo-600 dark:bg-indigo-500 border border-transparent rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] text-white hover:bg-indigo-700 dark:hover:bg-indigo-400 active:bg-indigo-900 transition ease-in-out duration-150 shadow-xl shadow-indigo-200 dark:shadow-none ${
                    disabled && 'opacity-25'
                } ` + className
            }
        >
            {children}
        </button>
    );
}
```

---

## 4. Hiển thị User trên Navbar (`AppLayout.tsx`)

Bạn cần lấy thông tin `auth` từ Inertia props để hiển thị.

```tsx
// resources/js/Layouts/AppLayout.tsx
const { auth } = usePage().props as any;

// Trong JSX của Navbar:
<div className="flex items-center gap-3">
    {auth.user ? (
        <div className="flex items-center gap-4 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200">{auth.user.name}</span>
                <Link 
                    href={route('logout')} 
                    method="post" 
                    as="button"
                    className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:underline"
                >
                    Đăng xuất
                </Link>
            </div>
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                {auth.user.name.charAt(0)}
            </div>
        </div>
    ) : (
        <Link href={route('login')} className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl text-xs transition-all active:scale-95">
            Đăng nhập
        </Link>
    )}
</div>
```

---

## 5. Tại sao Database hợp nhất lại giúp Quản lý Giỏ hàng tốt hơn?

*   **Dữ liệu đồng nhất**: Giỏ hàng (Cart) thường được lưu theo `user_id`. Vì bạn chỉ có một bảng `users`, bạn không cần lo lắng về việc khách hàng lúc thì có `customer_id`, lúc thì có `admin_id`.
*   **Checkout mượt mà**: Khi thanh toán, hệ thống chỉ cần gọi `auth()->user()->profile` để lấy sẵn địa chỉ và số điện thoại, giúp trải nghiệm mua hàng nhanh hơn gấp nhiều lần.
*   **Dễ dàng mở rộng**: Sau này bạn có thể thêm hệ thống "Khách hàng thân thiết" (Loyalty) gắn thẳng vào ID của User, rất tiện lợi cho các báo cáo thống kê.
