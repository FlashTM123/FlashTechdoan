<div align="center">
  <img src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1200&auto=format&fit=crop" alt="FlashTech Header" width="100%" style="border-radius: 20px; margin-bottom: 20px;" />
  <h1>⚡ FLASHTECH E-COMMERCE ECOSYSTEM</h1>
  <p><b>Hệ thống thương mại điện tử Laptop & Linh kiện công nghệ hiện đại</b></p>

  <!-- Badges -->
  <a href="https://laravel.com" target="_blank"><img src="https://img.shields.io/badge/Laravel_13-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel" /></a>
  <a href="https://react.dev" target="_blank"><img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" /></a>
  <a href="https://tailwindcss.com" target="_blank"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" /></a>
  <a href="https://www.mongodb.com" target="_blank"><img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" /></a>
</div>

---

## 🚀 Đột phá trong phiên bản mới (Cập nhật 04/05)

Hôm nay, FlashTech đã được nâng cấp toàn diện về mặt **Storefront (Giao diện người dùng)** với các tính năng cao cấp:

### 🌗 Premium Dark/Light Mode
- **Trải nghiệm đồng bộ:** Toàn bộ trang web (từ Header, Search Bar, Hero cho đến Footer) đều được tối ưu hóa cho chế độ tối.
- **Ghi nhớ thông minh:** Tự động lưu lựa chọn của người dùng vào LocalStorage và đồng bộ với cài đặt hệ thống (Windows/macOS).
- **Hiệu ứng mượt mà:** Chuyển đổi màu sắc với hiệu ứng `transition` dịu mắt.

### 🔍 Live Search & Suggestions
- **Tìm kiếm tức thì:** Gợi ý sản phẩm ngay khi người dùng gõ từ 2 ký tự.
- **Visual Feedback:** Hiển thị trực quan hình ảnh, tên sản phẩm và giá bán ngay trong dropdown gợi ý.
- **Debounce Optimization:** Tối ưu hóa hiệu suất server, giảm thiểu truy vấn thừa.

### 🔥 Gaming Universe Section
- **Thiết kế chuyên biệt:** Một không gian Dark Mode dành riêng cho Laptop Gaming với hiệu ứng ánh sáng (Glow) và độ tương phản cao.
- **Logic lọc thông minh:** Tự động lấy sản phẩm từ danh mục Gaming để hiển thị thành một khối riêng biệt đẳng cấp.

### 📊 Dynamic Technical Specifications
- **Cập nhật theo biến thể:** Bảng thông số kỹ thuật tự động thay đổi khi khách hàng chọn các phiên bản khác nhau (RAM/SSD).
- **Xử lý dữ liệu linh hoạt:** Hỗ trợ cả định dạng JSON Object và Array từ Database, đảm bảo hiển thị thông số mượt mà, không lỗi.

---

## 🛠️ Công nghệ cốt lõi

| Lớp (Layer) | Công nghệ | Mục đích |
|-------------|-------------------|---------------------|
| **Backend** | **Laravel 13** | API & Logic xử lý chính |
| **Frontend**| **React 19 + Inertia** | Trải nghiệm SPA không tải lại trang |
| **Styling** | **Tailwind CSS** | Giao diện hiện đại, tối ưu Mobile |
| **Admin**   | **Filament V5** | Quản trị sản phẩm, đơn hàng siêu tốc |
| **Dual DB** | **MySQL & MongoDB** | Lưu trữ quan hệ & Dữ liệu động (Specs, Reviews) |

---

## 🗄️ Kiến trúc Dual Database

FlashTech sử dụng kiến trúc kết hợp độc đáo:
- **MySQL**: Quản lý dữ liệu ACID (Người dùng, Đơn hàng, Biến thể sản phẩm).
- **MongoDB**: Quản lý dữ liệu linh hoạt (Thông số kỹ thuật động, Đánh giá sản phẩm, Nhật ký hệ thống).

---

## 🔧 Hướng dẫn Cài đặt nhanh

### 1. Cài đặt Dependencies
```bash
composer install
npm install --legacy-peer-deps
```

### 2. Thiết lập Môi trường
Sao chép `.env.example` thành `.env` và cấu hình MySQL/MongoDB. Sau đó chạy:
```bash
php artisan key:generate
php artisan migrate:fresh --seed
```

### 3. Khởi chạy Hệ thống
```bash
# Terminal 1
php artisan serve

# Terminal 2
npm run dev
```

---

## 📅 Nhật ký phát triển (Roadmap)

- [x] **Phase 1**: Khởi tạo Core & Dual Database System.
- [x] **Phase 2**: Xây dựng Admin Panel (Filament) & Quản lý Coupon.
- [x] **Phase 3**: Triển khai Storefront UI, Live Search & Dark Mode (Current).
- [ ] **Phase 4**: Hoàn thiện Giỏ hàng & Tích hợp Thanh toán Online.
- [ ] **Phase 5**: Tối ưu SEO & Đóng gói sản phẩm.

---
<div align="center">
  <i>Đồ Án Tốt Nghiệp - Phát triển bởi ❤️ FlashTech Team</i>
</div>
