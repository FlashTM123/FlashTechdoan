<div align="center">
  <img src="https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1200&auto=format&fit=crop" alt="FlashTech Header" width="100%" style="border-radius: 24px; margin-bottom: 24px; box-shadow: 0 20px 50px rgba(0,0,0,0.3);" />
  
  <h1>⚡ FLASHTECH: THE NEXT-GEN TECH COMMERCE</h1>
  <p><b>Hệ thống TMĐT Laptop & Đồ công nghệ cao cấp | Laravel 13 + React 19 + Filament V3</b></p>

  <div style="margin: 20px 0;">
    <img src="https://img.shields.io/badge/Laravel_13-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel" />
    <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Filament_V3-FFB11B?style=for-the-badge&logo=filament&logoColor=black" alt="Filament" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/MySQL_8-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
  </div>
</div>

---

## 🌟 Tầm nhìn dự án
**FlashTech** là một hệ thống thương mại điện tử chuyên biệt cho Laptop, tập trung vào trải nghiệm người dùng cao cấp (Premium UX) và quản trị doanh nghiệp chặt chẽ. Dự án được tối ưu hóa để vận hành ổn định trên các môi trường thực tế.

---

## 🚀 Các Module Đã Hoàn Thiện

### 🛒 1. Advanced Checkout & VNPay Integration
- **Hệ thống Thanh toán**: Tích hợp cổng thanh toán trực tuyến **VNPay** (Sandbox) cho các giao dịch an toàn.
- **Smart Coupon Logic**: Hệ thống mã giảm giá đa dạng, tự động kiểm tra điều kiện và áp dụng ngay tại trang thanh toán.
- **Anti-Abuse Control**: Giới hạn lượt dùng mã giảm giá trên mỗi tài khoản người dùng dựa trên lịch sử giao dịch.

### 📦 2. Order Management & Tracking
- **Order Tracking**: Khách hàng có thể theo dõi hành trình đơn hàng chi tiết qua các trạng thái: *Chờ xử lý, Đang xử lý, Đang giao, Đã giao hàng, Đã hủy*.
- **Premium Order Details Page**: Trang chi tiết đơn hàng hiển thị đầy đủ thông tin nhận hàng, hóa đơn chi tiết và sơ đồ tiến trình (timeline stepper) động.
- **Self-Cancel Logic**: Khách hàng tự hủy đơn khi ở trạng thái 'Chờ xử lý', tự động hoàn trả tồn kho.
- **Inventory Protection**: Khóa dữ liệu (Locking) khi đặt hàng, đảm bảo không bán quá số lượng thực tế.

### ⭐️ 3. Review & Feedback System
- **Verified Purchase**: Chỉ khách hàng đã nhận hàng thành công mới được quyền đánh giá.
- **Multi-Image Support**: Hỗ trợ đăng tải hình ảnh thực tế giúp tăng độ tin cậy.
- **Admin Moderation**: Kiểm duyệt và kiểm soát hiển thị đánh giá qua cơ chế Toggle.

### 🔄 4. Compare Products System
- **Variant Comparison**: So sánh cụ thể từng biến thể sản phẩm (CPU, RAM, GPU, Screen).
- **Highlight Differences**: Tự động phát hiện & làm nổi bật các thông số khác nhau.
- **Smart Storage**: Lưu danh sách so sánh vào localStorage, tự động phục hồi khi tải lại trang.
- **Multi-Compare**: Hỗ trợ so sánh tối đa 3 biến thể cùng lúc.
- **Show Differences Only**: Lọc chỉ hiển thị những thông số có sự khác biệt.

### 🎨 5. Admin Premium Dashboard & Real-time Notifications
- **Premium UI Redesign**: Tái thiết kế Dashboard với CSS tùy chỉnh, hover effects sang trọng.
- **Topbar Real-time Clock**: Đồng hồ thời gian thực bằng Alpine.js trực tiếp trên Topbar.
- **Instant Order Notifications**: Push Notification ngay lập tức cho Admin khi có đơn mới.
- **Smart Data Formatting**: Widget thống kê tự động rút gọn số tiền (tr ₫, tỷ ₫) và Việt hóa ngày tháng.

### 💎 6. Premium Customer Storefront (Apple Style UX)
- **Glassmorphism & Floating Navbar**: Thanh điều hướng nổi tự động thu nhỏ khi cuộn.
- **Micro-animations**: Hiệu ứng nảy (bounce), phát sáng (glow) trên các nút tương tác.
- **Apple-style Product Detail**: Chọn cấu hình tinh tế, tích hợp animation mượt mà và tồn kho real-time.
- **Advanced Filtering**: Bộ lọc chuyên nghiệp với Morphing Layout, chuyển đổi lưới hiển thị không độ trễ.
- **Dark/Light Mode**: Hoàn thiện 100% giao diện sáng tối.

### 🏅 7. Loyalty Points & Membership Tier System
- **Tích điểm tự động**: 1 điểm cho mỗi 100.000đ giá trị đơn hàng, cộng khi đơn được giao thành công.
- **4 hạng thành viên động**: Đồng (0-299đ) → Bạc (300-799đ) → Vàng (800-1.999đ) → Bạch kim (2.000đ+).
- **Quyền lợi theo hạng**: Bạc giảm 2%, Vàng giảm 5%, Bạch kim giảm 10% mọi đơn hàng.
- **Progress Bar**: Thanh tiến trình animate hiển thị số điểm cần để lên hạng tiếp theo.
- **Hoàn điểm**: Tự động thu hồi điểm nếu đơn hàng bị hủy sau khi đã giao.
- **Thông báo**: Push notification cho khách khi nhận điểm thưởng.

### 🛡️ 8. Active Brand Constraint Enforcement
- **Brand Status Propagation**: Ràng buộc trạng thái thương hiệu trên toàn hệ thống.
- **Automatic Product Hiding**: Thương hiệu ngưng hoạt động → sản phẩm tự ẩn khỏi Trang chủ, Danh sách, Tìm kiếm.
- **Sidebar Dynamic Filter**: Bộ lọc sidebar chỉ hiển thị thương hiệu đang hoạt động.

---

## 🗄️ Kiến trúc Dữ liệu (Database Architecture)
Dự án sử dụng **MySQL** làm cơ sở dữ liệu duy nhất, thiết kế theo chuẩn 3NF:
- **Auth & Users**: Quản lý tài khoản, phân quyền, điểm thành viên và hạng.
- **Products & Variants**: Quản lý Laptop theo từng SKU cấu hình (CPU, RAM, SSD) độc lập.
- **Orders & OrderItems**: Đơn hàng, chi tiết mặt hàng, trạng thái và lịch sử xử lý.
- **Coupons**: Mã giảm giá với nhiều loại và giới hạn sử dụng.

---

## 🛠️ Tech Stack & Công nghệ

### Backend
- **Framework**: Laravel 13 (PHP 8.3+)
- **ORM**: Eloquent ORM
- **Authentication**: Laravel Sanctum
- **Payment Gateway**: VNPay API
- **Admin Panel**: Filament V3
- **Real-time**: Laravel Events & Broadcasting

### Frontend
- **Framework**: React 19 (Inertia.js + Vite)
- **Styling**: Tailwind CSS + Dark Mode Support
- **Animations**: Framer Motion
- **State Management**: React Context API
- **HTTP Client**: Axios
- **UI Components**: Lucide React Icons, Sonner Toast
- **Type Safety**: TypeScript

### Infrastructure
- **Database**: MySQL 8.0
- **Server**: PHP 8.3, Node.js 20+
- **Containerization**: Docker + Laravel Sail
- **Build Tool**: Vite
- **Package Manager**: Composer, NPM

---

## 🔧 Cài đặt & Triển khai (Sử dụng Docker & Laravel Sail)

Dự án được tối ưu để khởi chạy trên Docker thông qua Laravel Sail, giúp đồng bộ môi trường chỉ với một lệnh duy nhất.

### Yêu cầu hệ thống:
- **Docker Desktop** đã cài đặt và đang chạy.
- (Với Windows) **WSL2** đã được kích hoạt.

---

### Các bước thiết lập & Khởi chạy:

1. **Cài đặt thư viện**:
   ```bash
   composer install
   npm install
   ```

2. **Cấu hình Environment (`.env`)**:
   Sao chép `.env.example` thành `.env` và cập nhật thông số kết nối:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=mysql
   DB_PORT=3306
   DB_DATABASE=flashtechdoan
   DB_USERNAME=sail
   DB_PASSWORD=password

   # Windows WSL2
   WWWGROUP=1000
   WWWUSER=1000
   ```

3. **Khởi chạy Docker Containers**:
   - **Giao diện trực quan**: Mở Docker Desktop → chọn project → bấm **Play**.
   - **Dòng lệnh (Windows PowerShell)**:
     ```powershell
     docker compose up -d
     ```
   - **Linux / macOS / Git Bash**:
     ```bash
     bash vendor/laravel/sail/bin/sail up -d
     ```

4. **Khởi tạo dữ liệu & Storage**:
   ```powershell
   # Tạo key ứng dụng
   docker compose exec laravel.test php artisan key:generate

   # Migration và seed dữ liệu mẫu
   docker compose exec laravel.test php artisan migrate --seed

   # Liên kết thư mục lưu trữ ảnh
   docker compose exec laravel.test php artisan storage:link
   ```

5. **Chạy Frontend (React/Vite)**:
   ```bash
   npm run dev
   ```
   Hoặc build production:
   ```bash
   ./vendor/bin/sail npm run build
   ```

---

### 🌐 Địa chỉ truy cập cục bộ:
| Dịch vụ | URL |
|---------|-----|
| 🛍️ Trang bán hàng | [http://localhost](http://localhost) |
| ⚙️ Trang quản trị | [http://localhost/admin](http://localhost/admin) |
| 🗄️ phpMyAdmin | [http://localhost:8080](http://localhost:8080) (`sail` / `password`) |

---

## 📖 Hướng dẫn Sử dụng Chính

### Loyalty Points & Membership
1. Đặt đơn hàng → Admin cập nhật trạng thái → **Đã giao hàng**
2. Hệ thống tự động cộng điểm: **1đ / 100.000đ** giá trị đơn
3. Xem điểm & hạng hiện tại tại trang **Hồ sơ** (`/profile`)
4. Hạng tự động thăng khi đủ ngưỡng điểm

### Compare Products
1. Chọn sản phẩm → Click "So sánh" (BarChart icon)
2. Chọn thêm đến 3 biến thể từ các sản phẩm khác
3. Vào trang `/compare` hoặc click icon Compare trong navbar
4. Lọc "Chỉ hiển thị điểm khác biệt" để tập trung vào sự khác nhau

### Shopping Cart & Checkout
1. Click "Thêm vào giỏ" trên trang chi tiết sản phẩm
2. Chọn số lượng & biến thể trước khi thêm
3. Nhập mã giảm giá (nếu có) tại trang giỏ hàng
4. Checkout qua VNPay hoặc COD

### Reviews & Ratings
1. Sau khi đơn hàng được giao → Viết đánh giá trên trang sản phẩm
2. Đính kèm hình ảnh thực tế (tuỳ chọn)
3. Admin kiểm duyệt trước khi hiển thị công khai

---

## 📁 Cấu trúc Project

```
FlashTech/
├── app/
│   ├── Http/Controllers/        # API & Web Controllers
│   │   └── Api/                 # Checkout, Cart, Coupon, Review
│   ├── Models/                  # Eloquent Models
│   │   └── Observers/           # OrderObserver (điểm thành viên)
│   ├── Events/                  # Order Events
│   └── Filament/                # Filament Resources & Dashboard
├── resources/
│   └── js/
│       ├── Pages/               # React Pages
│       │   ├── Products/        # ProductDetail, Index
│       │   ├── Cart/            # CartPage
│       │   ├── Profile/         # Show, Edit
│       │   └── Checkout.tsx     # Checkout & Success
│       ├── Components/          # Reusable Components
│       ├── Context/             # CartContext, CompareContext
│       └── Layouts/             # AppLayout, GuestLayout
├── routes/
│   ├── api.php                  # API Routes
│   └── web.php                  # Web Routes (Inertia)
├── database/
│   ├── migrations/              # Schema Migrations
│   └── seeders/                 # Database Seeders
└── storage/                     # User Uploads
```

---

## 🔌 API Endpoints (Compare Feature)

### POST `/api/products/compare`
So sánh nhiều biến thể sản phẩm
```json
// Request
{ "variant_ids": [1, 2, 3] }

// Response
{
  "status": "success",
  "data": [{
    "id": 1,
    "name": "Laptop Lenovo ThinkPad E16",
    "variants": [{
      "id": 1,
      "variant_name": "i7 16GB 512SSD",
      "price": 16490000,
      "stock": 10,
      "details": { "cpu": "Intel i7-1355U", "ram": "16GB DDR5" }
    }]
  }]
}
```

---

## 📅 Roadmap Phát triển

- [x] **Giai đoạn 1:** Khởi tạo Core, MySQL Database & Filament Dashboard.
- [x] **Giai đoạn 2:** Triển khai Storefront cơ bản & Tích hợp User.
- [x] **Giai đoạn 3:** Hoàn thiện Giỏ hàng, Lịch sử đơn hàng & User Profile.
- [x] **Giai đoạn 4:** Hệ thống Đánh giá (Review) & Mã giảm giá (Coupon).
- [x] **Giai đoạn 5:** Tích hợp cổng thanh toán VNPay.
- [x] **Giai đoạn 6:** Module So sánh sản phẩm (Compare Products).
- [x] **Giai đoạn 7:** Báo cáo doanh thu & Phân tích dữ liệu khách hàng.
- [x] **Giai đoạn 8:** **Nâng cấp UX/UI Premium** – Micro-animations, Glassmorphism, Dark Mode.
- [x] **Giai đoạn 9:** **Loyalty Points & Membership Tier System** – Tích điểm, 4 hạng thành viên.

---

## 🤝 Đóng góp & Hỗ trợ

### Yêu cầu PR
1. Fork project → Tạo branch feature (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Mở Pull Request

### Báo cáo Bug
- Dùng [GitHub Issues](../../issues/new) để báo cáo bugs
- Cung cấp chi tiết: mô tả, screenshot, steps to reproduce

---

## 📄 License

Dự án này được cấp phép dưới MIT License - xem file [LICENSE](LICENSE) để biết chi tiết.

---

<div align="center">
  <p><i>🎓 Dự án Đồ Án Tốt Nghiệp</i></p>
  <p><b>FlashTech E-Commerce Platform</b></p>
  <p>Xây dựng bởi ❤️ với <b>Laravel + React</b></p>
  <p>Developed with passion for modern web standards</p>
  <p>© 2026 FlashTech. All rights reserved.</p>
</div>
