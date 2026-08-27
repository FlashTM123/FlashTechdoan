<div align="center">
  <img src="https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1200&auto=format&fit=crop" alt="FlashTech Header" width="100%" style="border-radius: 24px; margin-bottom: 24px; box-shadow: 0 20px 50px rgba(0,0,0,0.3);" />
  
  <h1>⚡ FLASHTECH: THE NEXT-GEN TECH COMMERCE</h1>
  <p><b>Hệ thống TMĐT Laptop & Đồ công nghệ cao cấp | Laravel 13 + React 19 + Filament V3</b></p>

  <div style="margin: 20px 0;">
    <img src="https://img.shields.io/badge/Laravel_13-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel" />
    <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Filament_V3-FFB11B?style=for-the-badge&logo=filament&logoColor=black" alt="Filament" />
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/MySQL_8-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
    <img src="https://img.shields.io/badge/VNPay-0080FF?style=for-the-badge&logo=visa&logoColor=white" alt="VNPay" />
  </div>
</div>

---

## 🌟 Tầm nhìn dự án

**FlashTech** là hệ thống thương mại điện tử chuyên biệt dành cho **Laptop & Đồ công nghệ**, được xây dựng với kiến trúc hiện đại, tập trung vào:
- 🎨 **Premium UX** – Giao diện đẹp, mượt mà, chuẩn Dark/Light Mode
- 🔐 **Business Logic chặt chẽ** – Kiểm soát kho hàng, quy trình đơn hàng, phân quyền
- ⚡ **Real-time** – Thông báo tức thời qua WebSocket (Laravel Events)
- 📱 **Fully Responsive** – Tối ưu trên mọi thiết bị

---

## 🚀 Các Module Đã Hoàn Thiện

### 🛒 1. Advanced Checkout & VNPay Integration
- **Tích hợp VNPay**: Cổng thanh toán sandbox, redirect và xử lý callback an toàn
- **Phương thức thanh toán**: VNPay (active) + MoMo (Coming Soon badge)
- **Smart Coupon**: Mã giảm giá đa loại, kiểm tra điều kiện áp dụng tự động
- **Anti-Abuse**: Giới hạn lượt dùng mã giảm giá theo tài khoản
- **Repay Logic**: Tạo lại link thanh toán cho đơn chưa thanh toán từ trang lịch sử

### 📦 2. Order Management & Tracking
- **Order Tracking**: Theo dõi hành trình đơn qua 5 trạng thái với timeline stepper động
- **Self-Cancel**: Khách tự hủy đơn khi *Chờ xử lý*, tự động hoàn kho
- **Repay from History**: Thanh toán lại trực tiếp từ trang `/orders`
- **Premium Order Details**: Trang `/orders/{id}` hiển thị hóa đơn, địa chỉ, timeline
- **Inventory Lock**: Khóa số lượng tồn kho khi đặt hàng, tránh bán vượt

### ⚙️ 3. Admin Order Management (Filament)
- **Badge Status Column**: Cột trạng thái hiển thị badge màu sắc trực quan
- **Advance Action**: Nút "→ Đóng gói / → Giao hàng / → Đã giao" theo đúng quy trình
- **Cancel với Confirm Dialog**: Popup xác nhận trước khi hủy, hoàn kho tự động
- **Auto Processor**: Gán người duyệt đơn khi thay đổi trạng thái
- **Realtime Event**: Phát sự kiện `OrderStatusUpdated` thông báo cho khách hàng
- **Offline Order**: Tạo đơn bán tại quầy trực tiếp từ Admin
- **Filter & Sort**: Lọc theo trạng thái, hôm nay, cần xử lý; sort theo quy trình

### ⭐️ 4. Review & Feedback System
- **Verified Purchase**: Chỉ khách đã nhận hàng mới được đánh giá
- **Multi-Image**: Đính kèm ảnh thực tế khi đánh giá
- **Admin Moderation**: Toggle hiển thị đánh giá từ Filament

### 🔄 5. Compare Products System
- **Variant Comparison**: So sánh từng biến thể (CPU, RAM, GPU, màn hình)
- **Highlight Differences**: Tự động làm nổi bật thông số khác nhau
- **Smart Storage**: Lưu vào localStorage, phục hồi khi tải lại
- **Multi-Compare**: Tối đa 3 biến thể cùng lúc
- **Show Diff Only**: Lọc chỉ hiển thị điểm khác biệt

### 🎨 6. Admin Premium Dashboard
- **Custom UI**: CSS tùy chỉnh, hover effects sang trọng
- **Real-time Clock**: Đồng hồ Alpine.js trên Topbar
- **Instant Notifications**: Push notification khi có đơn mới
- **Smart Stats**: Widget thống kê rút gọn số tiền (tr ₫, tỷ ₫), Việt hóa ngày
- **Customer Management**: Danh sách khách hàng với tìm kiếm, xem chi tiết

### 💎 7. Premium Customer Storefront (Apple-style UX)
- **Glassmorphism Navbar**: Thanh điều hướng nổi, thu nhỏ khi cuộn
- **Micro-animations**: Hiệu ứng bounce, glow, slide trên mọi tương tác
- **Apple-style Product Detail**: Chọn cấu hình tinh tế, tồn kho real-time
- **Advanced Filtering**: Morphing layout, chuyển lưới không độ trễ
- **Dark/Light Mode**: Hoàn thiện 100%

### 🏅 8. Loyalty Points & Membership Tier System
- **Auto Points**: 1 điểm / 100.000đ, cộng khi đơn giao thành công
- **4 Hạng thành viên**: Đồng → Bạc (−2%) → Vàng (−5%) → Bạch kim (−10%)
- **Progress Bar**: Thanh tiến trình animate hiển thị điểm cần lên hạng
- **Point Revoke**: Thu hồi điểm tự động khi đơn hàng bị hủy
- **Notification**: Push notification khi nhận điểm thưởng

### 🛡️ 9. Brand Constraint Enforcement
- **Status Propagation**: Thương hiệu ngưng → sản phẩm ẩn khỏi toàn hệ thống
- **Dynamic Sidebar Filter**: Chỉ hiển thị thương hiệu đang hoạt động

---

## 🗄️ Kiến trúc Dữ liệu

Thiết kế theo chuẩn **3NF** với MySQL:

| Table | Mô tả |
|-------|-------|
| `users` | Tài khoản, phân quyền, điểm thành viên, hạng |
| `products` / `product_variants` | Laptop theo SKU cấu hình độc lập |
| `orders` / `order_items` | Đơn hàng, mặt hàng, lịch sử xử lý |
| `coupons` / `coupon_usages` | Mã giảm giá với giới hạn sử dụng |
| `reviews` / `review_images` | Đánh giá sản phẩm kèm ảnh |
| `payment_methods` | Phương thức thanh toán (VNPay, MoMo…) |
| `brands` / `categories` | Thương hiệu, danh mục |

---

## 🛠️ Tech Stack

### Backend
| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|---------|
| Laravel | 13 | Framework chính |
| PHP | 8.3+ | Runtime |
| Filament | V3 | Admin Panel |
| Eloquent ORM | — | Database Access |
| Laravel Events | — | Realtime notifications |
| VNPay API | Sandbox | Payment Gateway |

### Frontend
| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|---------|
| React | 19 | UI Framework |
| TypeScript | 5+ | Type Safety |
| Inertia.js | — | SPA Bridge |
| Vite | 6 | Build Tool |
| Tailwind CSS | 3 | Styling |
| Framer Motion | — | Animations |
| Lucide React | — | Icons |
| Sonner | — | Toast Notifications |
| Axios | — | HTTP Client |
| SweetAlert2 | — | Confirm Dialogs |

### Infrastructure
| Công nghệ | Mục đích |
|-----------|---------|
| MySQL 8.0 | Database |
| Docker + Laravel Sail | Containerization |
| Node.js 20+ | Frontend build |

---

## 🔧 Cài đặt & Triển khai

### Yêu cầu hệ thống
- **Docker Desktop** đã cài đặt và đang chạy
- *(Windows)* **WSL2** đã được kích hoạt

### Các bước thiết lập

```bash
# 1. Cài đặt dependencies
composer install
npm install

# 2. Tạo file .env
cp .env.example .env
```

Cập nhật `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=flashtechdoan
DB_USERNAME=sail
DB_PASSWORD=password

# VNPay (Sandbox)
vnp_tmn_code=YOUR_TMN_CODE
vnp_hash_secret=YOUR_HASH_SECRET
vnp_url=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
vnp_return_url=http://127.0.0.1:8000/api/checkout/vnpay-return
```

```bash
# 3. Khởi chạy Docker
docker compose up -d
# hoặc: bash vendor/laravel/sail/bin/sail up -d

# 4. Khởi tạo ứng dụng
docker compose exec laravel.test php artisan key:generate
docker compose exec laravel.test php artisan migrate --seed
docker compose exec laravel.test php artisan storage:link

# 5. Chạy Frontend
npm run dev
# Hoặc build production:
./vendor/bin/sail npm run build
```

### 🌐 Địa chỉ truy cập

| Dịch vụ | URL |
|---------|-----|
| 🛍️ Trang bán hàng | http://localhost |
| ⚙️ Trang quản trị | http://localhost/admin |
| 🗄️ phpMyAdmin | http://localhost:8080 (`sail` / `password`) |

### 👤 Tài khoản mặc định (sau seed)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@flashtech.vn | password |
| Customer | customer@example.com | password |

---

## 📖 Hướng dẫn Sử dụng Chính

### Quy trình xử lý đơn hàng (Admin)
```
Khách đặt → [Chờ xử lý] → (Admin: "→ Đóng gói") → [Đang đóng gói]
         → (Admin: "→ Giao hàng") → [Đang vận chuyển]
         → (Admin: "→ Đã giao") → [Đã giao hàng] ✓
         
         * Admin có thể hủy đơn ở bước Chờ xử lý hoặc Đang đóng gói
         * Hủy → tự động hoàn kho + thông báo realtime cho khách
```

### Loyalty Points & Membership
1. Đặt hàng → Admin chuyển sang "Đã giao hàng"
2. Hệ thống tự cộng điểm: **1đ / 100.000đ**
3. Xem điểm & hạng tại trang **Hồ sơ** (`/profile`)
4. Hạng tự thăng khi đủ ngưỡng

### Compare Products
1. Click "So sánh" (icon BarChart) trên bất kỳ sản phẩm nào
2. Thêm tối đa 3 biến thể từ các sản phẩm khác
3. Vào `/compare` → bật "Chỉ hiển thị điểm khác biệt"

---

## 📁 Cấu trúc Project

```
FlashTech/
├── app/
│   ├── Http/Controllers/
│   │   └── Api/                 # Checkout, Cart, Coupon, Review
│   ├── Models/
│   │   └── Observers/           # OrderObserver (điểm thành viên)
│   ├── Events/                  # OrderStatusUpdated, NewOrderPlaced
│   ├── Policies/                # Authorization Policies
│   └── Filament/
│       ├── Resources/           # Orders, Products, Customers...
│       └── Widgets/             # StatsOverview, Charts
├── resources/js/
│   ├── Pages/
│   │   ├── Products/            # Index, Show
│   │   ├── Orders/              # Index, Show
│   │   ├── Cart/                # Index
│   │   ├── Checkout/            # Index, Success, Fail
│   │   └── Profile/             # Show, Edit
│   ├── Components/              # Reusable Components
│   ├── Context/                 # CartContext, CompareContext
│   └── Layouts/                 # AppLayout, GuestLayout
├── routes/
│   ├── api.php                  # API Routes
│   └── web.php                  # Web Routes (Inertia)
├── database/
│   ├── migrations/
│   └── seeders/
└── storage/                     # User Uploads
```

---

## 📅 Roadmap Phát triển

- [x] **Giai đoạn 1** – Core, MySQL Schema, Filament Dashboard
- [x] **Giai đoạn 2** – Storefront cơ bản, Auth, User Profile
- [x] **Giai đoạn 3** – Giỏ hàng, Lịch sử đơn hàng, Theo dõi đơn
- [x] **Giai đoạn 4** – Đánh giá (Review), Mã giảm giá (Coupon)
- [x] **Giai đoạn 5** – Tích hợp cổng thanh toán VNPay
- [x] **Giai đoạn 6** – So sánh sản phẩm (Compare Products)
- [x] **Giai đoạn 7** – Báo cáo doanh thu, Phân tích dữ liệu khách hàng
- [x] **Giai đoạn 8** – Premium UX/UI – Micro-animations, Glassmorphism, Dark Mode
- [x] **Giai đoạn 9** – Loyalty Points & Membership Tier (4 hạng thành viên)
- [x] **Giai đoạn 10** – Admin Order Workflow – Badge status, Advance/Cancel actions, Confirm dialog

---

<div align="center">
  <p><i>🎓 Dự án Đồ Án Tốt Nghiệp</i></p>
  <p><b>FlashTech E-Commerce Platform</b></p>
  <p>Xây dựng bởi ❤️ với <b>Laravel 13 + React 19 + Filament V3</b></p>
  <p>© 2026 FlashTech. All rights reserved.</p>
</div>
