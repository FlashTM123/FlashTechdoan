# Cẩm nang Tối ưu Mobile (Responsive Design) với Tailwind CSS

Tài liệu này giúp bạn xử lý triệt để các lỗi vỡ khung, tràn viền và xây dựng giao diện Mobile chuyên nghiệp cho FlashTech.

## 1. Tư duy Mobile-First (Quan trọng nhất)

Trong Tailwind CSS, các Class không có tiền tố (ví dụ: `p-4`) sẽ áp dụng cho **Mobile trước**. Các tiền tố như `md:`, `lg:` chỉ áp dụng khi màn hình đạt đến kích thước đó trở lên.

*   **Sai**: Thiết kế cho Desktop rồi dùng class để ẩn/hiện cho Mobile.
*   **Đúng**: Viết class cho Mobile trước, sau đó thêm `md:` để điều chỉnh cho màn hình lớn.

---

## 2. Fix Lỗi Tràn Viền (Overflow-X)

Nếu web của bạn xuất hiện thanh cuộn ngang khó chịu trên điện thoại:

### Cách tìm phần tử gây lỗi:
Mở Console (F12) và dán đoạn code này để bao khung tất cả phần tử:
```javascript
$$('*').forEach(el => el.style.outline = '1px solid red')
```
Phần tử nào lòi ra ngoài khung đỏ chính là thủ phạm.

### Cách xử lý triệt để:
1.  Tại thẻ `body` hoặc thẻ bao ngoài cùng (`AppLayout`): Thêm `overflow-x-hidden`.
2.  Sử dụng `max-w-full` cho tất cả thẻ `img` và `video`.
3.  Tránh dùng kích thước cố định như `w-[500px]`, hãy dùng `w-full max-w-md`.

---

## 3. Xây dựng Mobile Header (Hamburger Menu)

Trên Mobile, chúng ta nên giấu Menu vào một nút bấm để tiết kiệm diện tích.

```tsx
const [isMenuOpen, setIsMenuOpen] = useState(false);

// Header
<nav className="flex justify-between items-center p-4">
    <Logo />
    
    {/* Nút Hamburger chỉ hiện trên Mobile */}
    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
        {isMenuOpen ? <X /> : <Menu />}
    </button>

    {/* Menu chính: Ẩn trên Mobile, hiện trên Desktop */}
    <div className="hidden md:flex gap-4">
        <Link>Sản phẩm</Link>
        <Link>Về chúng tôi</Link>
    </div>

    {/* Menu Mobile (Overlay/Dropdown) */}
    {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-xl md:hidden flex flex-col p-6 gap-4 z-50">
            <Link>Sản phẩm</Link>
            <Link>Về chúng tôi</Link>
        </div>
    )}
</nav>
```

---

## 4. Responsive Typography (Chữ co giãn)

Thay vì dùng một cỡ chữ cố định, hãy dùng các breakpoint:

*   **Tiêu đề**: `text-3xl md:text-5xl lg:text-6xl`
*   **Nội dung**: `text-sm md:text-base`

> **Mẹo**: Dùng đơn vị `clamp` nếu muốn chữ co giãn mượt mà không cần breakpoint: `text-[clamp(1.5rem,5vw,3rem)]`.

---

## 5. Stacking Buttons (Xếp chồng nút bấm)

Nút bấm trên Mobile cần to và dễ bấm, thường nên xếp theo chiều dọc.

```tsx
<div className="flex flex-col md:flex-row gap-4">
    <button className="w-full md:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl">
        Mua ngay
    </button>
    <button className="w-full md:w-auto px-8 py-4 border border-slate-200 rounded-xl">
        Thêm vào giỏ
    </button>
</div>
```
*   `flex-col`: Xếp chồng trên Mobile.
*   `md:flex-row`: Nằm ngang trên màn hình Medium trở lên.

---

## 6. Xử lý Hình ảnh (Image Handling)

### Ẩn ảnh trên Mobile:
Nếu ảnh Hero quá lớn và đẩy nội dung xuống quá sâu:
```tsx
<div className="hidden md:block">
    <img src="hero-desktop.jpg" />
</div>
```

### Thu nhỏ & Căn giữa:
Dùng `aspect-video` hoặc `aspect-square` để giữ tỉ lệ ảnh không bị bóp méo.
```tsx
<img src="..." className="w-full h-auto aspect-video object-cover rounded-2xl" />
```

---

## Tóm tắt quy tắc "Vàng":
1. Luôn dùng `px-4` hoặc `px-6` cho Container để nội dung không chạm sát mép màn hình điện thoại.
2. Nút bấm trên Mobile tối thiểu nên có chiều cao `h-12` (48px) để ngón tay dễ thao tác.
3. Luôn kiểm tra giao diện bằng **Responsive Mode** trong Chrome DevTools (Ctrl + Shift + M).
