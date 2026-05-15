<div align="center">
  <img src="https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1200&auto=format&fit=crop" alt="FlashTech Header" width="100%" style="border-radius: 24px; margin-bottom: 24px; box-shadow: 0 20px 50px rgba(0,0,0,0.3);" />
  
  <h1>⚡ FLASHTECH: THE NEXT-GEN TECH COMMERCE</h1>
  <p><b>Hệ thống TMĐT Laptop & Đồ công nghệ cao cấp | Laravel 13 + React 19 + Filament V5</b></p>

  <div style="margin: 20px 0;">
    <img src="https://img.shields.io/badge/Laravel_13-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel" />
    <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Filament_V5-FFB11B?style=for-the-badge&logo=filament&logoColor=black" alt="Filament" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  </div>
</div>

---

## 🌟 Tầm nhìn dự án
**FlashTech** là một hệ thống thương mại điện tử chuyên biệt cho Laptop, tập trung vào trải nghiệm người dùng cao cấp (Premium UX) và quản trị doanh nghiệp chặt chẽ.

---

## 🚀 Các Module Đột Phá Vừa Hoàn Thiện

### 🛒 1. Advanced Checkout & Discount System
- **Smart Coupon Logic**: Hệ thống mã giảm giá đa dạng (Cố định hoặc Phần trăm).
- **Anti-Abuse Control**: Giới hạn lượt dùng trên toàn hệ thống và **giới hạn mỗi người dùng chỉ được dùng 1 lần** thông qua truy vết lịch sử đơn hàng.
- **Transaction History**: Lưu vết số tiền đã giảm (`discount_amount`) ngay trong đơn hàng để đảm bảo tính toàn vẹn của hóa đơn kể cả khi mã giảm giá bị xóa.

### 📦 2. Order Management & Tracking
- **Real-time Status Sync**: Đồng bộ hóa trạng thái đơn hàng giữa Admin (Filament) và Khách hàng (React).
- **History Tracking**: Giao diện Lịch sử đơn hàng (My Orders) dạng Card với đầy đủ thông tin trạng thái: *Chờ xử lý, Đang xử lý, Đang giao, Đã giao hàng, Đã hủy*.
- **Self-Cancel Logic**: Khách hàng có thể tự hủy đơn khi ở trạng thái 'Chờ xử lý', tự động hoàn lại số lượng tồn kho (Stock).

### ⭐️ 3. Review & Feedback System
- **Verified Purchase Only**: Chỉ những khách hàng đã mua và nhận hàng thành công (`Delivered`) mới được phép gửi đánh giá.
- **Multi-Image Upload**: Hỗ trợ khách hàng đăng tải hình ảnh thực tế sản phẩm (Tối đa 5 ảnh).
- **Dynamic Rating**: Tự động tính toán số sao trung bình và số lượng đánh giá hiển thị ngay trên thẻ sản phẩm.
- **Admin Moderation**: Admin có quyền duyệt hoặc ẩn các bình luận không phù hợp trước khi hiển thị công khai.

---

## 🗄️ Kiến trúc Dữ liệu (Database Architecture)
Dự án được thiết kế theo quy chuẩn **3NF**, đảm bảo tối ưu hóa truy vấn và tránh dư thừa dữ liệu:
- **Product Variants**: Quản lý Laptop theo từng cấu hình (CPU, RAM, SSD, Màu sắc) với kho hàng riêng biệt.
- **Order Relationship**: Liên kết chặt chẽ giữa `Orders` -> `Coupons`, `Orders` -> `Payments` và `Orders` -> `Users`.
- **Hybrid Schema**: Sử dụng JSON cho danh sách hình ảnh đánh giá để tăng tốc độ load trang.

---

## 🔧 Cài đặt & Triển khai

1. **Clone project & Cài đặt thư viện**:
   ```bash
   composer install
   npm install
   ```
2. **Cấu hình Database**: Copy `.env.example` thành `.env` và cấu hình MySQL.
3. **Migrate & Seed**:
   ```bash
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
- [x] **Giai đoạn 2:** Triển khai Storefront cao cấp, Live Search & Premium Filtering.
- [x] **Giai đoạn 3:** Hợp nhất hệ thống User & Xây dựng User Profile.
- [x] **Giai đoạn 4:** Hoàn thiện Giỏ hàng & Lịch sử đơn hàng.
- [x] **Giai đoạn 5:** Hệ thống Đánh giá (Review) & Mã giảm giá (Coupon).
- [ ] **Giai đoạn 6:** Tích hợp VNPay/Momo & Thông báo Real-time.

---

<div align="center">
  <p><i>Dự án Đồ Án Tốt Nghiệp - Xây dựng bởi ❤️ <b>FlashTech Team</b></i></p>
  <p>Developed with passion for modern web standards.</p>
</div>
