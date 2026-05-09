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
**FlashTech** không chỉ là một trang web bán hàng, mà là một trải nghiệm số hóa đẳng cấp dành cho người yêu công nghệ. Dự án tập trung vào:
- **Visual Excellence:** Giao diện Editorial-grade với phong cách tối giản nhưng sang trọng.
- **Micro-interactions:** Hiệu ứng chuyển động mượt mà bằng Framer Motion.
- **Enterprise Management:** Quy trình quản trị đơn hàng và sản phẩm chuẩn hóa doanh nghiệp.

---

## 🚀 Các Module Đột Phá

### 🎨 1. Storefront Editorial Experience
- **Dynamic Catalog:** Hệ thống danh mục sản phẩm thông minh, tự động thay đổi giao diện theo context.
- **Smart Filtering:** Bộ lọc đa năng (Category, Brand, Price Range) với trải nghiệm "Instant Result".
- **Glassmorphism Sidebar:** Thiết kế sidebar dạng kính mờ, hỗ trợ Sticky-navigation khi cuộn trang.
- **Premium Dark Mode:** Tối ưu hóa độ tương phản và màu sắc sâu (`Slate-950`), giảm mỏi mắt cho người dùng.

### 🛡️ 2. Unified Identity System (Auth & Profile)
- **Hybrid Auth:** Hệ thống đăng nhập đa tầng cho Khách hàng và Nhân viên trên cùng một nền tảng.
- **Premium User Profile:** Trang cá nhân quản lý thông tin, lịch sử đơn hàng với giao diện đồng bộ.
- **Security Observer:** Tự động bảo mật và đồng bộ hóa dữ liệu thông qua Eloquent Observers (như việc tự động map `product_id` cho ảnh biến thể).

### ⚙️ 3. Enterprise Admin Dashboard (Filament V5)
- **Advanced Inventory:** Quản lý biến thể (Variants) đa cấp, tự động sinh SKU.
- **Order Audit Trail:** Truy vết mọi thao tác duyệt đơn hàng của nhân viên.
- **Live Statistics:** Biểu đồ doanh thu và tăng trưởng khách hàng thời gian thực.

---

## 🛠️ Stack Công nghệ & Kiến trúc

| Thành phần | Công nghệ | Chi tiết |
|-------------|-------------------|--------------------------------------|
| **Core** | **Laravel 13** | Framework hiện đại nhất |
| **View Layer**| **React 19 + Inertia** | Trải nghiệm Single Page App (SPA) |
| **Animations**| **Framer Motion** | Layout animations & Page transitions |
| **Styling** | **Tailwind CSS** | Thiết kế Responsive & Dark Mode |
| **Database** | **MySQL & MongoDB** | Quan hệ (Orders) & Linh hoạt (Specs/Reviews) |

---

## 🗄️ Kiến trúc Dữ liệu Hybrid
FlashTech tận dụng sức mạnh của cả hai thế giới:
- **MySQL (ACID):** Quản lý Giao dịch, Người dùng, Đơn hàng, và Cấu trúc Sản phẩm cốt lõi.
- **MongoDB (NoSQL):** Lưu trữ Thông số kỹ thuật động (Dynamic Specs) của từng loại Laptop khác nhau và Hệ thống Đánh giá (Reviews) đòi hỏi tính linh hoạt cao.

---

## 🔧 Cài đặt & Triển khai

### 1. Dependencies
```bash
composer install
npm install
```

### 2. Database Setup
Cấu hình `.env` với các tham số DB_CONNECTION (MySQL) và MONGODB_URI.
```bash
php artisan key:generate
php artisan migrate --seed
```

### 3. Development
```bash
# Terminal 1: Laravel Server
php artisan serve

# Terminal 2: Vite Build
npm run dev
```

---

## 📅 Roadmap Phát triển

- [x] **Giai đoạn 1:** Khởi tạo Core, Hybrid Database & Filament Dashboard.
- [x] **Giai đoạn 2:** Triển khai Storefront cao cấp, Live Search & Premium Filtering.
- [x] **Giai đoạn 3:** Hợp nhất hệ thống User & Xây dựng User Profile.
- [x] **Giai đoạn 4:** Tối ưu hóa Database (3NF) & Eloquent Observers.
- [ ] **Giai đoạn 5:** Hoàn thiện Giỏ hàng, Wishlist & Tích hợp VNPay/Momo.
- [ ] **Giai đoạn 6:** Hệ thống thông báo Real-time & App Mobile (PWA).

---

<div align="center">
  <p><i>Dự án Đồ Án Tốt Nghiệp - Xây dựng bởi ❤️ <b>FlashTech Team</b></i></p>
  <p>Developed with passion for modern web standards.</p>
</div>
