# Hướng Dẫn Hoàn Thiện Giao Diện FlashTech

Tài liệu này hướng dẫn bạn cách tích hợp các tính năng còn thiếu vào giao diện hiện tại, sử dụng **React**, **Tailwind CSS** và logic xử lý tối ưu.

---

## 1. Search Bar: Thanh tìm kiếm tinh tế
Thay vì chỉ là một icon đơn lẻ, hãy biến nó thành một thanh tìm kiếm có thể mở rộng hoặc nằm cố định với hiệu ứng glassmorphism.

### Code gợi ý cho `AppLayout.tsx`:
```tsx
// Thêm state vào AppLayout
const [searchTerm, setSearchTerm] = useState("");

// Thay thế đoạn code Icon Actions (dòng 78-81) bằng:
<div className="flex-1 max-w-md mx-8 hidden lg:block">
    <div className="relative group">
        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </span>
        <input
            type="text"
            placeholder="Tìm kiếm laptop, linh kiện..."
            className="w-full bg-slate-100 border-none rounded-2xl py-2.5 pl-12 pr-4 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
    </div>
</div>
```

---

## 2. Category Grid: Danh mục phổ biến
Nâng cấp phần "Category Quick Links" hiện tại thành một Grid chuyên nghiệp với các Icon được thiết kế riêng.

### Code gợi ý cho `Home.tsx` (Phần 2):
Sử dụng thư viện `lucide-react` để có các icon đồng nhất.

```tsx
import { Laptop, Cpu, MousePointer2, Headset, HardDrive, Monitor } from 'lucide-react';

const categoryIcons: any = {
    'laptop-gaming': <Laptop className="w-8 h-8" />,
    'linh-kien': <Cpu className="w-8 h-8" />,
    'phu-kien': <MousePointer2 className="w-8 h-8" />,
    // Thêm các slug tương ứng ở đây
};

// Trong component Home:
<section className="py-20 bg-white">
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {sections.map((cat: any) => (
            <Link key={cat.id} href={`/products?category=${cat.slug}`} className="group p-8 rounded-[2.5rem] bg-slate-50 hover:bg-indigo-600 transition-all duration-500 text-center flex flex-col items-center">
                <div className="mb-4 text-indigo-600 group-hover:text-white group-hover:scale-110 transition-transform duration-500">
                    {categoryIcons[cat.slug] || <Monitor className="w-8 h-8" />}
                </div>
                <span className="font-bold text-slate-800 group-hover:text-white transition-colors">{cat.name}</span>
            </Link>
        ))}
    </div>
</section>
```

---

## 3. Featured Section Logic: Lọc Laptop Gaming
Để hiển thị riêng biệt, bạn có thể lọc dữ liệu ngay trong component `Home` nếu backend gửi về toàn bộ danh sách.

### Logic xử lý trong `Home.tsx`:
```tsx
export default function Home({ featured_products, sections }: any) {
    // Logic lọc chuyên biệt cho Laptop Gaming
    const gamingLaptops = sections.find((s: any) => s.slug === 'laptop-gaming')?.products || [];

    return (
        <AppLayout>
            {/* ... */}
            {gamingLaptops.length > 0 && (
                <section className="py-24 bg-slate-900 rounded-[4rem] text-white my-20">
                    <div className="max-w-7xl mx-auto px-8">
                        <SectionHeader title="🔥 Gaming Universe" link="/products?category=laptop-gaming" />
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {gamingLaptops.slice(0, 4).map((p: any) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
            {/* ... */}
        </AppLayout>
    );
}
```

---

## 4. Review Section: Đánh giá khách hàng
Tạo một không gian tin cậy với các thẻ đánh giá có đổ bóng mềm mại.

### Component Review Grid:
```tsx
const reviews = [
    { name: "Anh Tuấn", role: "Developer", comment: "Máy chạy cực nhanh, build quality tuyệt vời!", stars: 5 },
    { name: "Minh Hạnh", role: "Designer", comment: "Màn hình chuẩn màu, dịch vụ bảo hành rất tốt.", stars: 5 },
    { name: "Hoàng Nam", role: "Gamer", comment: "Giá tốt nhất thị trường, sẽ ủng hộ tiếp.", stars: 4 },
];

<section className="py-24">
    <SectionHeader title="Khách hàng nói về FlashTech" link="#" />
    <div className="grid md:grid-cols-3 gap-8">
        {reviews.map((r, i) => (
            <div key={i} className="p-8 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-xl transition-all">
                <div className="flex gap-1 mb-4 text-yellow-400">
                    {[...Array(r.stars)].map((_, s) => <span key={s}>★</span>)}
                </div>
                <p className="text-slate-600 mb-6 italic">"{r.comment}"</p>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-600">
                        {r.name[0]}
                    </div>
                    <div>
                        <h5 className="font-bold text-slate-900">{r.name}</h5>
                        <span className="text-xs text-slate-400">{r.role}</span>
                    </div>
                </div>
            </div>
        ))}
    </div>
</section>
```

---

## 5. UX: Cuộn mượt mà (Smooth Scroll)
Cách đơn giản và hiệu quả nhất là sử dụng ID và CSS Native.

### Bước 1: Thêm ID vào phần sản phẩm trong `Home.tsx`
```tsx
<section id="product-list" className="py-24">
    <SectionHeader title="Sản phẩm nổi bật" ... />
</section>
```

### Bước 2: Cập nhật nút 'Mua ngay' trong `Hero.tsx`
```tsx
<button 
    onClick={() => document.getElementById('product-list')?.scrollIntoView({ behavior: 'smooth' })}
    className="px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-200 active:scale-95"
>
    Mua ngay
</button>
```

### Bước 3: Đảm bảo CSS hỗ trợ (Tùy chọn)
Thêm dòng này vào file CSS chính của bạn (`app.css`):
```css
html {
  scroll-behavior: smooth;
}
```

---
**Lời khuyên:** Hãy luôn sử dụng `rounded-[2rem]` hoặc `rounded-3xl` để tạo cảm giác hiện đại, kết hợp với `backdrop-blur` cho các phần floating để trang web trông "đẳng cấp" hơn.
