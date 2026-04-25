# FlashTech - Graduation Project

## 📋 Giới thiệu Dự Án

**FlashTech** là một hệ thống quản lý e-commerce được xây dựng cho đồ án tốt nghiệp với kiến trúc hiện đại:

- **Client Side**: Giao diện người dùng (React + Inertia)
- **Admin Panel**: Hệ thống quản trị (Filament V5)
- **Dual Database**: 
  - **MySQL**: Quản lý User/Auth
  - **MongoDB**: Quản lý Products/Specs

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Laravel 11 |
| Frontend | React + Inertia |
| Admin | Filament V5 |
| Auth | Laravel Breeze |
| DB (User) | MySQL |
| DB (Product) | MongoDB |
| Build Tool | Vite |

---

## ✅ Hoàn Tất (Ngày 25/04/2026)

### Bước 1: Khởi tạo Laravel 11
- ✅ Tạo project mới với `composer create-project laravel/laravel`
- ✅ Thiết lập cấu trúc folder cơ bản

### Bước 2: Database MySQL
- ✅ Tạo database `flashtech` trong Laragon/XAMPP
- ✅ Cấu hình `.env` kết nối MySQL
- ✅ Chạy `php artisan migrate`

### Bước 3: Laravel Breeze (React + Inertia)
- ✅ Cài đặt `laravel/breeze`
- ✅ Chọn React + Inertia stack
- ✅ Cấu hình TypeScript + ESLint + Prettier
- ✅ Tạo file `bootstrap.ts` (fix missing import)
- ✅ Chạy `npm install --legacy-peer-deps` (fix Vite conflict)
- ✅ Build thành công: `npm run build`

### Bước 4: Filament V5 Admin Panel
- ✅ Cài đặt `filament/filament` v5.0+ (fix ext-intl)
- ✅ Chạy `php artisan filament:install --panels`
- ✅ Panel name: `admin`
- ✅ Tạo Super Admin user
- ✅ Admin panel accessible tại: `http://localhost:8000/admin`

---

## 📝 Cấu Hình File Quan Trọng

### `.env` (MySQL)
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=flashtech
DB_USERNAME=root
DB_PASSWORD=
```

### `config/database.php`
- Sử dụng MySQL cho connections mặc định
- MongoDB sẽ thêm vào bước 5

---

## 🚀 Chạy Dự Án

```bash
# Terminal 1: Laravel Server
php artisan serve

# Terminal 2: Vite Dev Server (nếu cần)
npm run dev
```

Truy cập:
- **Client**: http://localhost:8000
- **Admin**: http://localhost:8000/admin
- **Register**: http://localhost:8000/register

---

## 📦 Bước Tiếp Theo (Ngày 25/04/2026)

### Bước 5: Cài Đặt MongoDB
- Cài đặt `mongodb/laravel-mongodb`
- Cấu hình dual database (MySQL + MongoDB)
- Thiết lập models cho Products/Specs

### Bước 6: Tối Ưu Vite cho Dell E5450
- Giảm CPU usage khi dev
- Tối ưu build time

---

## 🔧 Công Cụ & Phiên Bản

- PHP: 8.5.5
- Composer: 2.9.7
- Node: 24.14.1
- npm: 11.12.1
- Laravel: 11
- Filament: 5.x
- React: Latest
- Inertia: Latest

---

## 📌 Ghi Chú

- **Laragon/XAMPP**: Đang sử dụng cho development
- **MySQL**: `flashtech` database
- **Vite**: Đã fix deprecation warnings
- **PHP ext-intl**: Enabled cho Filament
