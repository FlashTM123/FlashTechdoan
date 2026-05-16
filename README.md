<div align="center">
  <img src="https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1200&auto=format&fit=crop" alt="FlashTech Header" width="100%" style="border-radius: 24px; margin-bottom: 24px; box-shadow: 0 20px 50px rgba(0,0,0,0.3);" />
  
  <h1>⚡ FLASHTECH: THE NEXT-GEN TECH COMMERCE</h1>
  <p><b>Hệ thống TMĐT Laptop & Đồ công nghệ cao cấp | Laravel 11 + React 19 + Filament V3</b></p>

  <div style="margin: 20px 0;">
    <img src="https://img.shields.io/badge/Laravel_11-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel" />
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

### 🛒 1. Advanced Checkout & VNPay Integration
- **Hệ thống Thanh toán**: Tích hợp cổng thanh toán trực tuyến **VNPay** (Sandbox) cho các giao dịch an toàn.
- **Smart Coupon Logic**: Hệ thống mã giảm giá đa dạng, tự động kiểm tra điều kiện và áp dụng ngay tại trang thanh toán.
- **Anti-Abuse Control**: Giới hạn lượt dùng mã giảm giá trên mỗi tài khoản người dùng dựa trên lịch sử giao dịch.

### 📦 2. Order Management & Tracking
- **Order Tracking**: Khách hàng có thể theo dõi hành trình đơn hàng chi tiết qua các trạng thái: *Chờ xử lý, Đang xử lý, Đang giao, Đã giao hàng, Đã hủy*.
- **Self-Cancel Logic**: Cho phép khách hàng tự hủy đơn khi ở trạng thái 'Chờ xử lý', tự động hoàn trả số lượng tồn kho (Stock) vào hệ thống ngay lập tức.
- **Inventory Protection**: Hệ thống khóa dữ liệu (Locking) khi đặt hàng để đảm bảo không xảy ra tình trạng bán quá số lượng thực tế.

### ⭐️ 3. Review & Feedback System
- **Verified Purchase**: Chỉ những khách hàng đã nhận hàng thành công mới được quyền đánh giá sản phẩm.
- **Multi-Image Support**: Hỗ trợ đăng tải hình ảnh thực tế giúp tăng độ tin cậy cho cửa hàng.
- **Admin Moderation**: Hệ thống quản trị cho phép kiểm duyệt nội dung và kiểm soát hiển thị đánh giá thông qua cơ chế Toggle thông minh.

---

## 🗄️ Kiến trúc Dữ liệu (Database Architecture)
Dự án được thiết kế theo quy chuẩn chuyên nghiệp, kết hợp sức mạnh của nhiều loại Database:
- **MySQL (Main)**: Quản lý Auth, Đơn hàng, Mã giảm giá và các quan hệ 3NF.
- **MongoDB (Catalog)**: Lưu trữ thông tin sản phẩm và thông số kỹ thuật (Specs) linh hoạt.
- **Product Variants**: Quản lý Laptop theo từng SKU cấu hình (CPU, RAM, SSD) độc lập.

---

## 🔧 Cài đặt & Triển khai

1. **Clone project & Cài đặt thư viện**:
   ```bash
   composer install
   npm install
   ```
2. **Cấu hình Database**: Copy `.env.example` thành `.env` và điền các thông tin kết nối DB, VNPay.
3. **Khởi tạo dữ liệu**:
   ```bash
   php artisan key:generate
   php artisan migrate --seed
   php artisan storage:link
   ```
4. **Chạy Project**:
   ```bash
   # Terminal 1
   php artisan serve
   # Terminal 2
   npm run dev
   ```

---

## 📅 Roadmap Phát triển

- [x] **Giai đoạn 1:** Khởi tạo Core, Hybrid Database & Filament Dashboard.
- [x] **Giai đoạn 2:** Triển khai Storefront cao cấp & Premium Filtering.
- [x] **Giai đoạn 3:** Hợp nhất hệ thống User & Xây dựng User Profile.
- [x] **Giai đoạn 4:** Hoàn thiện Giỏ hàng & Lịch sử đơn hàng.
- [x] **Giai đoạn 5:** Hệ thống Đánh giá (Review) & Mã giảm giá (Coupon).
- [ ] **Giai đoạn 6:** Hoàn thiện tích hợp cổng thanh toán VNPay & MoMo.
- [ ] **Giai đoạn 7:** Phát triển module So sánh sản phẩm (Compare Products).
- [ ] **Giai đoạn 8:** Hệ thống Báo cáo doanh thu & Phân tích dữ liệu khách hàng.
- [ ] **Giai đoạn 9:** Tối ưu hóa trải nghiệm Mobile (PWA) & Hiệu năng hệ thống.

---

<div align="center">
  <p><i>Dự án Đồ Án Tốt Nghiệp - Xây dựng bởi ❤️ <b>FlashTech Team</b></i></p>
  <p>Developed with passion for modern web standards.</p>
</div>
