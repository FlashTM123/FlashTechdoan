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
- [x] **User Management**: Hoàn thiện module quản lý nhân viên trên Filament (Modals CRUD, khóa tài khoản).
- [x] **Customer Management**: Thiết kế bảng `customers` độc lập với `users`. Cấu hình **CustomerResource** chuẩn Filament V5.
- [x] **Authentication Security (Multi-auth)**: Phân tách Authentication Guards (`web` & `customer`) trong `config/auth.php`. Cấu hình Session riêng biệt tránh xung đột ID.
- [x] **Brand & Category Management**: Tích hợp tính năng sinh Real-time Slug tự động khi gõ Tên thương hiệu/Danh mục.
- [x] **Product & Variant Management**: Quản lý sản phẩm dạng Tabs thông minh. Hỗ trợ lưu trữ không giới hạn biến thể kèm thuộc tính riêng.
- [x] **Review & Feedback Management**: Quản lý đánh giá sản phẩm (Duyệt/ẩn nhanh bằng Toggle). Tích hợp Seeder mẫu chuẩn chỉnh.
- [x] **Order Management**: Module quản lý đơn hàng hoàn chỉnh với infolist chi tiết. Tự động hoàn kho khi hủy đơn.
- [x] **UX/UI & Dashboard Optimization**: Sắp xếp nhóm Menu, thiết kế Widget phân tích tự động: Biểu đồ cơ cấu hàng, Bảng dữ liệu nhanh, Thống kê tổng quan tự động reload mỗi 30 giây.

---

### 📅 Nhật ký thay đổi — 01/05/2026

#### 🔧 Admin Panel — Filament UI/UX

**1. Dark Mode Fix (`AdminPanelProvider.php`)**
- Sửa lỗi nền trang bị cứng màu trắng khi bật Dark Mode do CSS `body { background-color }` ghi đè toàn bộ.
- Áp dụng selector `html:not(.dark)` để màu nền xám chỉ hiện ở Light Mode.
- Thêm `dark .fi-section` để các khối Section tự điều chỉnh viền và màu nền trong Dark Mode.

**2. Order Detail — Chuyển sang Slide-Over (`OrderResource.php`)**
- Thay thế trang `ViewOrder` riêng biệt bằng **slide-over panel** (bảng chi tiết mở từ phía phải màn hình).
- Thiết kế lại `infolist()` theo layout phù hợp với slide-over: từng Section xếp dọc thay vì grid 2 cột.
- **Header đơn hàng**: Mã đơn hàng + Badge trạng thái (Chờ xử lý / Đang xử lý / Đã giao...).
- **Danh sách mặt hàng**: Ảnh sản phẩm + Tên + SKU + Giá (màu primary) + Số lượng.
- **Tóm tắt tài chính**: Tạm tính / Phí ship / Tổng cộng + Badge trạng thái thanh toán.
- **Thông tin phụ**: Khách hàng & Địa chỉ đặt song song 2 cột; Ghi chú tự thu gọn nếu trống.
- Xóa file `ViewOrder.php` và route `'view'` không còn sử dụng.

**3. Product Detail — Slide-Over mới (`ProductResource.php`)**
- Thêm phương thức `infolist()` cho ProductResource với thiết kế đồng nhất với Order.
- **Header sản phẩm**: Ảnh thumbnail + Tên + Badges (Thương hiệu / Danh mục / Nổi bật / Trạng thái bán).
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
