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

## 🔐 Hợp nhất Hệ thống User & Premium Auth (Cập nhật 07/05)

Hôm nay, FlashTech đã nâng cấp hệ thống định danh và bảo mật lên tiêu chuẩn chuyên nghiệp:

### 👤 Hợp nhất Cơ sở dữ liệu Người dùng
- **Unified Identity:** Hợp nhất bảng `customers` vào `users`. Toàn bộ dữ liệu khách hàng hiện được quản lý tập trung, giúp đơn giản hóa quy trình đặt hàng và báo cáo.
- **Role-Based Guards:** Triển khai Guard riêng biệt cho `web` (Khách hàng) và `admin` (Nhân viên). Đảm bảo tính độc lập tuyệt đối của phiên làm việc (Session).
- **Security First:** Chặn hoàn toàn quyền truy cập chéo giữa các giao diện (Nhân viên không được đăng nhập tại trang khách và ngược lại).

### 🎨 Tái cấu hình Trải nghiệm Đăng nhập (Auth UI)
- **Premium Design:** Thay thế trang Login/Register mặc định bằng giao diện **Split-screen** đẳng cấp, sử dụng hình ảnh Laptop 4K nghệ thuật.
- **Component Redesign:** Tùy biến lại toàn bộ các UI components (`PrimaryButton`, `TextInput`) sang phong cách bo góc lớn, đồng bộ với ngôn ngữ thiết kế Apple-inspired.
- **Staff Navbar Badge:** Tự động nhận diện và hiển thị nhãn **"STAFF"** kèm lối tắt vào Dashboard nhanh trên thanh điều hướng nếu người dùng là Quản trị viên.

### 📊 Tối ưu hóa Quản trị (Filament)
- **Dynamic Stats:** Widget thống kê đã được cập nhật để truy vấn dữ liệu trực tiếp từ bảng User đã hợp nhất.
- **Read-only Customer View:** Thiết lập trang xem thông tin khách hàng chuyên biệt, đảm bảo an toàn dữ liệu khách hàng.

---

## 🏗️ Chuẩn hóa Hệ thống & Quản trị Doanh nghiệp (Cập nhật 06/05)

Hôm nay, FlashTech đã hoàn thành bước ngoặt về **Kiến trúc dữ liệu** và **Quy trình vận hành chuyên nghiệp**:

### 💎 Chuẩn hóa Database (Normalization - 3NF)
- **Từ JSON sang Relational:** Loại bỏ hoàn toàn việc lưu thông số kỹ thuật dạng JSON trong bảng sản phẩm. Thay thế bằng bảng quan hệ `product_variant_details` (1-N).
- **Tối ưu hóa Truy vấn:** Sử dụng Eager Loading (`with('details')`) giúp giảm thiểu N+1 query, tăng tốc độ tải trang chi tiết sản phẩm.
- **Tính nhất quán dữ liệu:** Đảm bảo mọi thông số kỹ thuật đều có cấu trúc rõ ràng (`attribute_name`, `attribute_value`), sẵn sàng cho tính năng lọc sản phẩm (Filtering) nâng cao.

### 💳 Hệ thống Thanh toán & Truy vết (Audit Trail)
- **Quản lý Thanh toán Tập trung:** Tách biệt phương thức thanh toán thành bảng `payment_methods`, cho phép dễ dàng mở rộng MoMo, VNPAY, COD... mà không cần sửa code.
- **Truy vết Duyệt đơn:** Mọi đơn hàng giờ đây đều lưu vết `processed_by_id`. Hệ thống tự động ghi nhận nhân viên/admin xử lý khi đơn hàng thay đổi trạng thái.
- **Badge Vai trò:** Hiển thị thông tin người duyệt kèm Badge vai trò (Admin/Staff) trực quan trong trang quản trị.

### ⚙️ Tự động hóa & Branding
- **Auto-SKU Generation:** Hệ thống tự động sinh mã SKU duy nhất cho từng biến thể sản phẩm (Format: `FT-XXXXXX`), giảm thiểu sai sót nhập liệu thủ công.
- **Official Branding:** Chuyển đổi toàn bộ nhận diện từ "Laravel" sang thương hiệu chính thức **FlashTech** trên toàn bộ Dashboard và tiêu đề ứng dụng.

---

## 🚀 Đột phá trong Giao diện (Cập nhật 04/05)

FlashTech đã được nâng cấp toàn diện về mặt **Storefront (Giao diện người dùng)** với các tính năng cao cấp:

### 🌗 Premium Dark/Light Mode
- **Trải nghiệm đồng bộ:** Toàn bộ trang web đều được tối ưu hóa cho chế độ tối (Header, Search Bar, Hero, Footer).
- **Ghi nhớ thông minh:** Tự động lưu lựa chọn của người dùng và đồng bộ với cài đặt hệ thống.

### 🔍 Live Search & Suggestions
- **Tìm kiếm tức thì:** Gợi ý sản phẩm kèm hình ảnh và giá bán ngay khi người dùng gõ từ khóa.
- **Hiệu ứng mượt mà:** Tối ưu hóa hiệu suất server, giảm thiểu truy vấn thừa.

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
- [x] **Phase 2**: Xây dựng Admin Panel & Quản lý Coupon.
- [x] **Phase 3**: Triển khai Storefront UI, Live Search & Dark Mode.
- [x] **Phase 4**: Chuẩn hóa Database 3NF, Hợp nhất User & Bảo mật đa tầng.
- [ ] **Phase 5**: Hoàn thiện Giỏ hàng & Tích hợp Thanh toán Online thực tế.
- [ ] **Phase 6**: Tối ưu SEO & Đóng gói sản phẩm.

---
<div align="center">
  <i>Đồ Án Tốt Nghiệp - Phát triển bởi ❤️ FlashTech Team</i>
</div>
