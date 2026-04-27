<div align="center">
  <h1>🚀 FlashTech E-Commerce System</h1>
  <p>Hệ thống quản lý E-Commerce hiện đại phục vụ Đồ án Tốt nghiệp</p>

  <!-- Badges -->
  <a href="https://laravel.com" target="_blank"><img src="https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel" /></a>
  <a href="https://react.dev" target="_blank"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" /></a>
  <a href="https://filamentphp.com" target="_blank"><img src="https://img.shields.io/badge/Filament-EAB308?style=for-the-badge&logo=laravel&logoColor=black" alt="Filament V5" /></a>
  <a href="https://www.mysql.com" target="_blank"><img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" /></a>
  <a href="https://www.mongodb.com" target="_blank"><img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" /></a>
  <a href="https://vitejs.dev" target="_blank"><img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" /></a>
</div>

---

## 📑 Mục lục
- [Giới thiệu](#-giới-thiệu)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cấu trúc Database](#-cấu-trúc-database-dual-db-architecture)
- [Tiến độ Dự án](#-tiến-độ-dự-án)
- [Hướng dẫn Cài đặt](#-hướng-dẫn-cài-đặt)

---

## 📋 Giới thiệu
**FlashTech** là nền tảng thương mại điện tử được phát triển với kiến trúc **Dual Database** tiên tiến nhằm tối ưu hóa hiệu suất và khả năng mở rộng. Dự án phân tách rõ ràng giữa:
- **Client-side (Frontend)**: Cung cấp trải nghiệm mua sắm mượt mà với ReactJS & Inertia (SPA).
- **Admin Panel (Backend)**: Bảng điều khiển quản trị mạnh mẽ và tốc độ cao bằng Filament V5.

---

## 🛠️ Công nghệ sử dụng
| Lớp (Layer) | Công nghệ cốt lõi | Chi tiết & Mục đích |
|-------------|--------------------|---------------------|
| **Backend** | [Laravel 13](https://laravel.com) | API & Logic cốt lõi của hệ thống |
| **Frontend**| [React 19](https://react.dev) + [Inertia](https://inertiajs.com) | Client-side rendering, SPA routing không cần reload |
| **Admin**   | [Filament V5](https://filamentphp.com) | Xây dựng Dashboard quản trị nhanh chóng (TALL stack framework) |
| **Auth**    | [Laravel Breeze](https://laravel.com/docs/starter-kits#laravel-breeze) | Xác thực người dùng cơ bản (Login, Register) |
| **DB 1**    | [MySQL](https://www.mysql.com) | Quản lý quan hệ dữ liệu khắt khe: Users, Roles, Auth, Orders |
| **DB 2**    | [MongoDB](https://www.mongodb.com) | Quản lý cấu trúc dữ liệu linh hoạt: Products, Specs, Categories |
| **Build**   | [Vite](https://vitejs.dev) | Trình đóng gói module siêu tốc cho Frontend |

---

## 🗄️ Cấu trúc Database (Dual DB Architecture)
Hệ thống sử dụng đồng thời 2 hệ quản trị cơ sở dữ liệu để tận dụng tối đa thế mạnh của từng loại:

### 1. Relational DB (MySQL)
Chịu trách nhiệm cho dữ liệu cần tính nhất quán (ACID) cao:
- Bảng `users` (Thông tin nhân viên nội bộ)
- Bảng `customers` (Thông tin khách hàng mua hàng - Tách biệt hoàn toàn)
- Quản lý phân quyền (Roles/Permissions)
- Quản lý phiên làm việc (`sessions` & `customer_sessions`)

### 2. NoSQL DB (MongoDB)
Chịu trách nhiệm cho dữ liệu sản phẩm linh hoạt, không đồng nhất:
- `products` collection (Thông tin sản phẩm)
- Thông số kỹ thuật động (Dynamic Specifications)
- Danh mục sản phẩm đa cấp (Hierarchical Categories)

---

## 🚀 Tiến độ Dự án

### ✅ Các module đã hoàn thiện
- [x] **Core System**: Khởi tạo Laravel 13, thiết lập kiến trúc cơ bản.
- [x] **Database Setup**: Tích hợp và cấu hình thành công MySQL & MongoDB.
- [x] **Frontend Foundation**: Tích hợp Laravel Breeze với React + Inertia. Build thành công Vite cho môi trường production.
- [x] **Admin Framework**: Cài đặt Filament V5, tối ưu giao diện Admin Panel.
- [x] **User Management**: Hoàn thiện toàn bộ module quản lý nhân viên trên Filament (Modals CRUD, khóa tài khoản).
- [x] **Customer Management**:
  - Thiết kế bảng `customers` (MySQL) độc lập với bảng `users`.
  - Cấu hình **CustomerResource** theo chuẩn Filament V5.
  - Thiết lập nghiệp vụ thực tế: Chặn Admin tạo mới khách hàng; các trường thông tin cá nhân ở chế độ **Read-only**; Admin chỉ được phép **Đổi trạng thái (is_active)** và **Xóa**.
  - Tạo Seeder đổ dữ liệu mẫu 5 khách hàng thành công.
- [x] **Authentication Security (Multi-auth)**:
  - Phân tách Authentication Guards (`web` & `customer`) và User Providers tương ứng trong `config/auth.php`.
  - Cấu hình hệ thống lưu trữ Session riêng biệt cho khách hàng (`customer_sessions`) tránh xung đột ID.
- [x] **Brand Management**:
  - Thiết kế bảng `brands` (MySQL).
  - Tích hợp tính năng sinh Real-time Slug tự động khi gõ Tên thương hiệu.
  - CRUD Thương hiệu mượt mà trên Modal.

### 🚧 Lộ trình tiếp theo (Roadmap)
- [ ] **Sản phẩm (Product Management)**: Xây dựng CRUD cho Products & Categories (MongoDB).
- [ ] **Khách hàng (Storefront)**: Giao diện hiển thị sản phẩm trên React.
- [ ] **Giỏ hàng & Đơn hàng**: Tích hợp luồng giỏ hàng và thanh toán.

---

## 💻 Hướng dẫn Cài đặt

### 1. Yêu cầu hệ thống
- PHP: `>= 8.2`
- Node.js: `>= 20.x`
- Composer: `>= 2.x`
- MySQL & MongoDB đang chạy ở background.

### 2. Khởi tạo Dự án
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
php artisan migrate:fresh
php artisan db:seed --class=UserSeeder
php artisan db:seed --class=CustomerSeeder

# Terminal 1: Khởi động Server PHP
php artisan serve

# Terminal 2: Khởi động Vite (Frontend Watcher)
npm run dev
```

---
<div align="center">
  <i>Được phát triển với ❤️ cho Đồ án Tốt nghiệp</i>
</div>
