<div align="center">
  <img src="https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1200&auto=format&fit=crop" alt="FlashTech Header" width="100%" style="border-radius: 24px; margin-bottom: 24px; box-shadow: 0 20px 50px rgba(0,0,0,0.3);" />
  
  <h1>⚡ FLASHTECH: THE NEXT-GEN TECH COMMERCE</h1>
  <p><b>Hệ thống TMĐT Laptop & Đồ công nghệ cao cấp | Laravel 13 + React 19 + Filament V3</b></p>

  <div style="margin: 20px 0;">
    <img src="https://img.shields.io/badge/Laravel_13-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel" />
    <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Filament_V3-FFB11B?style=for-the-badge&logo=filament&logoColor=black" alt="Filament" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  </div>
</div>

---

## 🌟 Tầm nhìn dự án
**FlashTech** là một hệ thống thương mại điện tử chuyên biệt cho Laptop, tập trung vào trải nghiệm người dùng cao cấp (Premium UX) và quản trị doanh nghiệp chặt chẽ. Dự án được tối ưu hóa để vận hành ổn định trên các môi trường thực tế.

---

## 🚀 Các Module Đột Phá Đã Hoàn Thiện

### 🛒 1. Advanced Checkout & VNPay Integration (Đang phát triển)
- **Hệ thống Thanh toán**: Tích hợp cổng thanh toán trực tuyến **VNPay** (Sandbox) cho các giao dịch an toàn.
- **Smart Coupon Logic**: Hệ thống mã giảm giá đa dạng, tự động kiểm tra điều kiện và áp dụng ngay tại trang thanh toán.
- **Anti-Abuse Control**: Giới hạn lượt dùng mã giảm giá trên mỗi tài khoản người dùng dựa trên lịch sử giao dịch.

### 📦 2. Order Management & Tracking
- **Order Tracking**: Khách hàng có thể theo dõi hành trình đơn hàng chi tiết qua các trạng thái: *Chờ xử lý, Đang xử lý, Đang giao, Đã giao hàng, Đã hủy*.
- **Premium Order Details Page (Show)**: Trang chi tiết đơn hàng riêng biệt, hiển thị đầy đủ thông tin nhận hàng (tên, SĐT, địa chỉ), hóa đơn chi tiết (bao gồm giảm giá coupon), và sơ đồ tiến trình (timeline stepper) động cực đẹp.
- **Self-Cancel Logic**: Cho phép khách hàng tự hủy đơn khi ở trạng thái 'Chờ xử lý' trực tiếp tại trang danh sách hoặc trang chi tiết đơn hàng (có SweetAlert2 xác nhận), tự động hoàn trả số lượng tồn kho (Stock) vào hệ thống ngay lập tức.
- **Inventory Protection**: Hệ thống khóa dữ liệu (Locking) khi đặt hàng để đảm bảo không xảy ra tình trạng bán quá số lượng thực tế.

### ⭐️ 3. Review & Feedback System
- **Verified Purchase**: Chỉ những khách hàng đã nhận hàng thành công mới được quyền đánh giá sản phẩm.
- **Multi-Image Support**: Hỗ trợ đăng tải hình ảnh thực tế giúp tăng độ tin cậy cho cửa hàng.
- **Admin Moderation**: Hệ thống quản trị cho phép kiểm duyệt nội dung và kiểm soát hiển thị đánh giá thông qua cơ chế Toggle thông minh.

### 🔄 4. Compare Products System (Phase 7)
- **Variant Comparison**: So sánh cụ thể từng biến thể sản phẩm (CPU, RAM, GPU, Screen) chứ không chỉ sản phẩm chung.
- **Highlight Differences**: Tự động phát hiện & làm nổi bật các thông số khác nhau giữa sản phẩm so sánh (màu nền tím).
- **Smart Storage**: Lưu danh sách so sánh vào localStorage, tự động phục hồi khi tải lại trang.
- **Multi-Compare**: Hỗ trợ so sánh tối đa 3 biến thể cùng lúc, có thể từ cùng 1 sản phẩm hoặc khác sản phẩm.
- **Show Differences Only**: Tính năng lọc chỉ hiển thị những thông số có sự khác biệt giữa các sản phẩm.

### 🎨 5. Admin Premium Dashboard & Real-time Notifications
- **Filament V5 Migration**: Cập nhật toàn bộ hệ thống Actions và Notifications theo chuẩn kiến trúc mới của Filament v5.
- **Premium UI Redesign**: Tái thiết kế toàn bộ Dashboard với CSS tùy chỉnh (Gỡ viền cam, tối ưu typography, hover effects) giúp giao diện sang trọng, gọn gàng.
- **Topbar Real-time Clock**: Tích hợp đồng hồ thời gian thực bằng Alpine.js trực tiếp lên Topbar của Filament (bên cạnh Avatar người dùng).
- **Instant Order Notifications**: Áp dụng hệ thống Filament Database Notification để báo động (Push Notification) ngay lập tức cho Admin khi có khách hàng đặt đơn mới mà không cần reload trang.
- **Smart Data Formatting**: Các Widget thống kê (như Doanh thu) tự động rút gọn số tiền (tr ₫, tỷ ₫) và Việt hóa ngôn ngữ ngày tháng.

### 💎 6. Premium Customer Storefront (Apple Style UX)
- **Glassmorphism & Parallax**: Thanh điều hướng nổi (Floating Pill) tự động thu nhỏ, kết hợp Hero Section 3D với các huy hiệu bay lơ lửng.
- **Micro-animations**: Hiệu ứng nảy (bounce), phát sáng (glow), và lóe sáng (shine) trên các nút tương tác (Thêm giỏ hàng, Chọn cấu hình, Mã giảm giá).
- **Apple-style Product Detail**: Nút chọn cấu hình tinh tế, tích hợp Animation mượt mà và hiển thị tồn kho Real-time.
- **Advanced Filtering**: Bộ lọc chuyên nghiệp với hiệu ứng Morphing Layout, chuyển đổi lưới hiển thị không độ trễ.
- **Dark/Light Mode Optimized**: Hoàn thiện 100% giao diện sáng tối, đảm bảo độ tương phản hoàn hảo và trải nghiệm thị giác cao cấp nhất.

### 🫙 7. Edit Product Detail & Product Manager
- **Edit & Change Position Discription and Specitification**: Làm lại 2 vị trí phần mô tả và thông số chi tiết để nhìn gọn mắt hơn và thay đổi giới hạn hiển thị ở thông số kĩ thuật.
- **Change Position Old Price and Price**: Thay đổi vị trí giá bán và giá gốc, và đổi tên giá gốc thành giá chưa giảm.
- **Change Type Discription in Database**: Điểu chỉnh lại cột discription trong bảng Product sang Text thay vì VARCHAR.
- **Filament Image Bulk Upload**: Bổ sung tính năng tải lên hàng loạt ảnh sản phẩm trong admin bằng các hook vòng đời (`afterCreate`, `afterSave`), giúp tải lên cùng lúc 10-20 ảnh mượt mà, không gặp lỗi nghẽn Livewire.

### 🛡️ 8. Active Brand Constraint Enforcement
- **Brand Status Propagation**: Tích hợp điều kiện ràng buộc trạng thái của thương hiệu trên toàn hệ thống storefront.
- **Automatic Product Hiding**: Khi một thương hiệu bị chuyển sang trạng thái ngưng hoạt động (`is_active = false`), toàn bộ sản phẩm của thương hiệu đó sẽ tự động ẩn hoàn toàn khỏi Trang chủ, Trang danh sách sản phẩm, Trang tìm kiếm nhanh (API Search) và chặn truy cập trực tiếp trang chi tiết.
- **Sidebar Dynamic Filter**: Bộ lọc thương hiệu ở sidebar của trang cửa hàng chỉ hiển thị các thương hiệu đang hoạt động để tối ưu trải nghiệm mua sắm.

---

## 🗄️ Kiến trúc Dữ liệu (Database Architecture)
Dự án được thiết kế theo quy chuẩn chuyên nghiệp, kết hợp sức mạnh của nhiều loại Database:
- **MySQL (Main)**: Quản lý Auth, Đơn hàng, Mã giảm giá và các quan hệ 3NF.
- **Product Variants**: Quản lý Laptop theo từng SKU cấu hình (CPU, RAM, SSD) độc lập.

---

## 🛠️ Tech Stack & Công nghệ

### Backend
- **Framework**: Laravel 13 (PHP 8.3+)
- **ORM**: Eloquent + Laravel MongoDB
- **Authentication**: Laravel Sanctum
- **Payment Gateway**: VNPay API
- **Admin Panel**: Filament V3 (Premium Laravel Dashboard)

### Frontend  
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS + Dark Mode Support
- **Animations**: Framer Motion
- **State Management**: React Context API
- **HTTP Client**: Axios
- **UI Components**: Lucide React Icons, SweetAlert2, Sonner Toast
- **Type Safety**: TypeScript

### Infrastructure
- **Database**: MySQL 8.0, MongoDB Atlas
- **Server**: PHP 8.3, Node.js 20+
- **Build Tool**: Vite
- **Package Manager**: Composer, NPM

---

## 🔧 Cài đặt & Triển khai

1. **Clone project & Cài đặt thư viện**:
   ```bash
   composer install
   npm install
   ```
2. **Cấu hình Environment**: Copy `.env.example` thành `.env` và điền:
   ```
   DB_CONNECTION=mysql
   DB_DATABASE=flashtech_doan
   DB_USERNAME=root
   
   MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/?appName=FlashTech
   MONGO_DB=flashtech_product
   ```
3. **Khởi tạo dữ liệu**:
   ```bash
   php artisan key:generate
   php artisan migrate --seed
   php artisan storage:link
   ```
4. **Chạy Project**:
   ```bash
   # Terminal 1 - Backend
   php artisan serve
   
   # Terminal 2 - Frontend
   npm run dev
   
   # Terminal 3 (Optional) - Queue & Logs
   php artisan queue:listen
   ```

---

## 📖 Hướng dẫn Sử dụng Chính

### Compare Products
1. Chọn sản phẩm bất kỳ → Click "So sánh" (BarChart icon)
2. Chọn thêm đến 3 biến thể từ các sản phẩm khác
3. Vào trang `/compare` hoặc click icon Compare trong navbar
4. **Tính năng**:
   - Xem thông số đầy đủ của từng biến thể
   - Click "Chỉ hiển thị điểm khác biệt" để lọc thông số khác
   - Xóa sản phẩm bằng nút "Xóa" (Trash icon)
   - Mua ngay từ trang so sánh

### Shopping Cart
1. Click "Thêm vào giỏ" trên trang chi tiết sản phẩm
2. Chọn số lượng & biến thể trước khi thêm
3. Xem tóm tắt trong icon Shopping Cart (navbar)
4. Checkout qua VNPay (Sandbox mode)

### Reviews & Ratings
1. Sau khi đơn hàng được giao → Viết đánh giá
2. Đính kèm hình ảnh thực tế của sản phẩm
3. Admin kiểm duyệt trước khi hiển thị

---

## 📁 Cấu trúc Project

```
FlashTech/
├── app/
│   ├── Http/Controllers/        # API Controllers
│   ├── Models/                  # Eloquent Models
│   └── Filament/               # Filament Resources
├── resources/
│   ├── js/
│   │   ├── Pages/              # React Pages (Products, Compare, Checkout, etc)
│   │   ├── Components/         # Reusable React Components
│   │   ├── Context/            # React Context (Cart, Compare)
│   │   ├── hooks/              # Custom React Hooks
│   │   └── utils/              # Helper Functions
│   └── views/                  # Blade Templates
├── routes/
│   ├── api.php                 # API Routes
│   └── web.php                 # Web Routes (Inertia)
├── database/
│   ├── migrations/             # Schema Migrations
│   └── seeders/                # Database Seeders
└── storage/                    # User Uploads
```

---

## 🔌 API Endpoints (Compare Feature)

### POST `/api/products/compare`
So sánh nhiều biến thể sản phẩm
```javascript
Request:
{
  "variant_ids": [1, 2, 3]  // Max 3 variants
}

Response:
{
  "status": "success",
  "data": [
    {
      "id": 1,                    // Variant ID
      "name": "Product Name",
      "variants": [{
        "id": 1,
        "variant_name": "i7 RTX3060",
        "price": 36990000,
        "stock": 10,
        "details": {
          "cpu": "Intel i7-11800H",
          "ram": "16GB DDR4",
          "gpu": "RTX 3060"
        }
      }]
    }
  ]
}
```

---

## 📅 Roadmap Phát triển

- [x] **Giai đoạn 1:** Khởi tạo Core, Hybrid Database & Filament Dashboard.
- [x] **Giai đoạn 2:** Triển khai Storefront cơ bản & Tích hợp User.
- [x] **Giai đoạn 3:** Hoàn thiện Giỏ hàng, Lịch sử đơn hàng & User Profile.
- [x] **Giai đoạn 4:** Hệ thống Đánh giá (Review) & Mã giảm giá (Coupon).
- [x] **Giai đoạn 5:** Hoàn thiện tích hợp cổng thanh toán VNPay.
- [x] **Giai đoạn 6:** Phát triển module So sánh sản phẩm (Compare Products).
- [x] **Giai đoạn 7:** Hệ thống Báo cáo doanh thu & Phân tích dữ liệu khách hàng.
- [x] **Giai đoạn 8:** **Nâng cấp Toàn diện UX/UI (Premium Redesign)** - Hoàn thiện các hiệu ứng Micro-animations & Glassmorphism.
- [x] **Giai đoạn 9:** Tối ưu hóa hiệu năng hệ thống & Triển khai thực tế.

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

### Hỗ trợ
📧 **Email**: support@flashtech.dev  
📞 **Discord**: [Tham gia server](https://discord.gg/flashtech)

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

