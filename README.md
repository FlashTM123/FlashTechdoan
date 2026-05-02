<div align="center">
  <h1>⚡ FlashTech E-Commerce System</h1>
  <p>Hệ thống quản lý E-Commerce hiện đại phục vụ Đồ Án Tốt nghiệp</p>

  <!-- Badges -->
  <a href="https://laravel.com" target="_blank"><img src="https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel" /></a>
  <a href="https://react.dev" target="_blank"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" /></a>
  <a href="https://filamentphp.com" target="_blank"><img src="https://img.shields.io/badge/Filament-EAB308?style=for-the-badge&logo=laravel&logoColor=black" alt="Filament V5" /></a>
  <a href="https://www.mysql.com" target="_blank"><img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" /></a>
  <a href="https://www.mongodb.com" target="_blank"><img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" /></a>
  <a href="https://vitejs.dev" target="_blank"><img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" /></a>
</div>

---

## 📋 Mục lục
- [Giới thiệu](#-giới-thiệu)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cấu trúc Database](#-cấu-trúc-database-dual-db-architecture)
- [Tiến độ Dự Án](#-tiến-độ-dự-án)
- [Hướng dẫn Cài đặt](#-hướng-dẫn-cài-đặt)

---

## 🌟 Giới thiệu
**FlashTech** là nền tảng thương mại điện tử được phát triển với kiến trúc **Dual Database** tiên tiến nhằm tối ưu hóa hiệu suất và khả năng mở rộng. Dự án phân tách rõ ràng giữa:
- **Client-side (Frontend)**: Cung cấp trải nghiệm mua sắm mượt mà với ReactJS & Inertia (SPA).
- **Admin Panel (Backend)**: Bảng điều khiển quản trị mạnh mẽ và tốc độ cao bằng Filament V5.

---

## 🛠️ Công nghệ sử dụng
| Lớp (Layer) | Công nghệ cốt lõi | Chi tiết & Mục đích |
|-------------|-------------------|---------------------|
| **Backend** | [Laravel 13](https://laravel.com) | API & Logic cốt lõi của hệ thống |
| **Frontend**| [React 19](https://react.dev) + [Inertia](https://inertiajs.com) | Client-side rendering, SPA routing không cần reload |
| **Admin**   | [Filament V5](https://filamentphp.com) | Xây dựng Dashboard quản trị nhanh chóng (TALL stack) |
| **Auth**    | [Laravel Breeze](https://laravel.com/docs/starter-kits#laravel-breeze) | Xác thực người dùng cơ bản (Login, Register) |
| **DB 1**    | [MySQL](https://www.mysql.com) | Quản lý quan hệ dữ liệu khắt khe: Users, Products, Orders |
| **DB 2**    | [MongoDB](https://www.mongodb.com) | Quản lý cấu trúc dữ liệu mở rộng: Dynamic Specs, Logs, Reviews |
| **Build**   | [Vite](https://vitejs.dev) | Trình đóng gói module siêu tốc cho Frontend |

---

## 🗄️ Cấu trúc Database (Dual DB Architecture)
Hệ thống sử dụng đồng thời 2 hệ quản trị cơ sở dữ liệu để tận dụng tối đa thế mạnh của từng loại:

### 1. Relational DB (MySQL)
Chịu trách nhiệm cho dữ liệu cần tính nhất quán (ACID) cao:
- Bảng `users` (Thông tin nhân viên nội bộ)
- Bảng `customers` (Thông tin khách hàng mua hàng)
- Bảng `products` (Thông tin sản phẩm chính)
- Bảng `product_variants` (Cấu hình chi tiết của từng biến thể: CPU/RAM/SSD/Giá/Màu/SKU)
- Bảng `categories` & `brands` (Danh mục và thương hiệu liên kết)
- Bảng `orders` & `order_items` (Đơn hàng và chi tiết mặt hàng)

### 2. NoSQL DB (MongoDB)
Chịu trách nhiệm lưu trữ các thông tin động linh hoạt:
- Reviews (Đánh giá sản phẩm)
- Dynamic Specifications (Thông số kỹ thuật mở rộng)
- Activity Logs (Nhật ký hành vi)

---

## 🚀 Tiến độ Dự Án

### ✅ Các module đã hoàn thiện

- [x] **Core System**: Khởi tạo Laravel 13, thiết lập kiến trúc cơ bản.
- [x] **Database Setup**: Tích hợp và cấu hình thành công MySQL & MongoDB.
- [x] **Frontend Foundation**: Tích hợp Laravel Breeze với React + Inertia.
- [x] **Admin Framework**: Cài đặt Filament V5, tối ưu giao diện Admin Panel.
- [x] **User Manage- [x] **Product & Variant Management**: Quản lý sản phẩm dạng Tabs thông minh. Hỗ trợ lưu trữ không giới hạn biến thể kèm thuộc tính riêng.
- [x] **Review & Feedback Management**: Quản lý đánh giá sản phẩm (Duyệt/ẩn nhanh bằng Toggle).
- [x] **Order Management**: Module quản lý đơn hàng hoàn chỉnh với infolist chi tiết.
- [x] **Coupon Management**: Hệ thống mã giảm giá (Fixed/Percent) với giới hạn lượt dùng và ngày hết hạn. Tích hợp logic tính toán trực tiếp vào đơn hàng.
- [x] **UX/UI & Dashboard Optimization**: Sắp xếp nhóm Menu, thiết kế Widget doanh thu và biểu đồ SalesChart trực quan.

---

### 📅 Nhật ký thay đổi — 02/05/2026

#### 🎫 Hệ thống Mã giảm giá (Coupons)
- **Database**: Tạo bảng `coupons` và liên kết `coupon_id` vào đơn hàng.
- **Model Logic**: Tích hợp `isValid()` và `calculateDiscount()`. Đơn hàng tự động áp dụng mã và lưu snapshot số tiền giảm.
- **Interface**: Quản lý CRUD mã giảm giá với tính năng tự động viết hoa Code và cảnh báo ngày hết hạn.
- **Testing**: Hoàn thiện bộ Unit Test cho logic Coupon tại `tests/Unit/CouponTest.php`.

#### 🛡️ Phân quyền người dùng (RBAC - Role Based Access Control)
- **Kiến trúc**: Sử dụng hệ thống Policy nội bộ kết hợp với cột `role` có sẵn (`admin`, `moderator`, `employee`).
- **Phân quyền Module**:
    - **Admin**: Toàn quyền hệ thống.
    - **Moderator**: Quản lý Sản phẩm, Đơn hàng, Mã giảm giá và Đánh giá. Không có quyền quản lý Nhân sự.
    - **Employee**: Chỉ được xem (View-only) hầu hết các module. Riêng module Đơn hàng chỉ được phép cập nhật Trạng thái giao hàng (khóa các trường giá tiền/thông tin khách).
- **Bảo mật Dashboard**: Ẩn các Widget báo cáo doanh thu nhạy cảm đối với vai trò Employee.
- **UI Security**: Tự động ẩn các nút "Thêm mới", "Sửa", "Xóa" trên giao diện dựa theo vai trò của người đang đăng nhập.

---

## 🧪 Kiểm thử (Testing)

### 1. Chạy Unit Test cho Coupon
```bash
php artisan test tests/Unit/CouponTest.php
```

### 2. Kiểm tra Phân quyền
Hãy thử đăng nhập bằng các tài khoản sau để kiểm tra giao diện:
- **Admin**: `admin@flashtech.com` (Toàn quyền)
- **Staff**: `staff@flashtech.com` (Chỉ cập nhật trạng thái đơn hàng)

---

## 🔧 Hướng dẫn Cài đặt
 / Danh mục / Nổi bật / Trạng thái bán).
- **Giá bán**: Hiển thị Giá thấp nhất / Giá cao nhất / Tổng tồn kho dạng 3 cột.
- **Biến thể**: Danh sách từng variant: Tên cấu hình + SKU + Giá + Tồn kho (màu xanh/đỏ tùy trạng thái).
- **Mô tả**: Thu gọn mặc định, click để mở.
- Chuyển `ViewAction` sang `->slideOver()` với độ rộng `4xl`.
- Xóa route `'view'` riêng, không cần trang `ViewProduct` nữa.

**4. User Management — Giữ nguyên**
- Đã thử nghiệm layout sidebar kiểu `filament-page-with-sidebar` nhưng gặp vấn đề tương thích namespace.
- Quyết định **giữ nguyên giao diện Modal mặc định** của Filament cho module User để đảm bảo ổn định.

---

### 📌 Roadmap tiếp theo
- [ ] **Storefront (React)**: Giao diện hiển thị sản phẩm trên frontend React.
- [ ] **Giỏ hàng & Thanh toán**: Tích hợp luồng giỏ hàng và payment gateway.
- [ ] **Xác thực khách hàng**: Login/Register cho khách hàng trên Inertia.

---

## 🔧 Hướng dẫn Cài đặt

### 1. Yêu cầu hệ thống
- PHP: `>= 8.2`
- Node.js: `>= 20.x`
- Composer: `>= 2.x`
- MySQL & MongoDB đang chạy ở background.

### 2. Khởi tạo Dự Án
```bash
# Clone source code và cài dependencies
composer install --prefer-dist
npm install --legacy-peer-deps

# Thiết lập môi trường
cp .env.example .env
php artisan key:generate
```

### 3. Cấu hình Cơ sở dữ liệu (`.env`)
```env
# Thiết lập MySQL
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=flashtech
DB_USERNAME=root
DB_PASSWORD=

# Thiết lập MongoDB
MONGODB_URI="mongodb://localhost:27017"
MONGODB_DATABASE=flashtech_project
```

### 4. Khởi chạy
```bash
# Terminal 1: Chạy migrate dữ liệu và Seeder
php artisan migrate:fresh --seed

# Terminal 1: Khởi động Server PHP
php artisan serve

# Terminal 2: Khởi động Vite (Frontend Watcher)
npm run dev
```

---
<div align="center">
  <i>Được phát triển với ❤️ cho Đồ Án Tốt nghiệp</i>
</div>
