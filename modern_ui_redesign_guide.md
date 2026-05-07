# Cẩm nang Thiết kế Giao diện Hiện đại (Premium Tech UI)

Tài liệu này hướng dẫn cách nâng cấp giao diện FlashTech theo phong cách sang trọng, mượt mà của Apple và Samsung, sử dụng React 19, Tailwind CSS và Framer Motion.

## 1. Modern UI Palette & Typography

Để web nhìn "sang", chúng ta cần tránh dùng màu sắc thuần (như đen 100% #000). Thay vào đó, hãy dùng các tông màu Slate hoặc Zinc.

### Bảng màu gợi ý:
*   **Light Mode**:
    *   Background: `#F8FAFC` (Slate-50)
    *   Card: `#FFFFFF` với Border `#F1F5F9` (Slate-100)
    *   Primary Accent: `#6366F1` (Indigo-500)
*   **Dark Mode**:
    *   Background: `#020617` (Slate-950)
    *   Card: `#0F172A` (Slate-900) với Border `#1E293B` (Slate-800)
*   **Typography**:
    *   Font chính: **Inter** (Sạch sẽ, dễ đọc).
    *   Font tiêu đề: **Outfit** hoặc **Lexend** (Hiện đại, bo tròn tinh tế).

---

## 2. Framer Motion Integration

Cài đặt: `npm install framer-motion`

### Hiệu ứng danh sách sản phẩm (Stagger Children)
Giúp các sản phẩm xuất hiện lần lượt từ dưới lên.

```tsx
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

// Sử dụng:
<motion.div variants={container} initial="hidden" animate="show" className="grid ...">
    {products.map(p => (
        <motion.div variants={item} key={p.id}>
            <ProductCard product={p} />
        </motion.div>
    ))}
</motion.div>
```

---

## 3. Skeleton Loading (Tailwind CSS)

Tạo cảm giác ứng dụng load cực nhanh bằng cách giả lập khung xương.

```tsx
const ProductSkeleton = () => (
  <div className="animate-pulse bg-white rounded-3xl p-4 border border-slate-100">
    <div className="aspect-square bg-slate-200 rounded-2xl mb-4" />
    <div className="h-6 bg-slate-200 rounded-full w-3/4 mb-2" />
    <div className="h-4 bg-slate-100 rounded-full w-1/2" />
  </div>
);
```

---

## 4. Product Detail Redesign (Sticky Layout)

Bố trí theo dạng "Left Gallery - Right Content" phổ biến ở các trang công nghệ lớn.

```tsx
<div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start py-12 px-6">
    {/* TRÁI: Gallery Ảnh (Có thể dùng Framer Motion AnimatePresence để đổi ảnh mượt) */}
    <div className="sticky top-24 space-y-4">
        <motion.div 
            key={activeImage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-[2.5rem] p-12 shadow-sm border border-slate-100 flex items-center justify-center"
        >
            <img src={activeImage} className="max-h-[500px] object-contain" />
        </motion.div>
    </div>

    {/* PHẢI: Thông tin (Tự cuộn độc lập) */}
    <div className="space-y-12">
        <header>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight">iPhone 15 Pro</h1>
            <p className="text-2xl text-slate-500 mt-4">Titan tự nhiên. Siêu bền. Siêu nhẹ.</p>
        </header>
        
        {/* Lựa chọn biến thể... */}
        
        <div className="pt-8 border-t border-slate-100">
             <button className="w-full bg-slate-900 text-white py-6 rounded-2xl font-bold text-xl hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-[0.98]">
                Mua ngay
            </button>
        </div>
    </div>
</div>
```

---

## 5. Micro-animations & Feedback

### Toast Notification (Dùng Sonner)
Cài đặt: `npm install sonner`

```tsx
import { toast } from 'sonner';

const addToCart = () => {
    // Logic thêm giỏ hàng...
    toast.success('Đã thêm vào giỏ hàng', {
        description: 'Sản phẩm của bạn đã sẵn sàng trong giỏ.',
        action: {
            label: 'Xem giỏ hàng',
            onClick: () => console.log('Go to cart')
        },
    });
};
```

---

## 6. Kỹ thuật "Fly to Cart" (Mẹo)

Để làm hiệu ứng một chấm tròn bay vào icon giỏ hàng:
1.  Lấy tọa độ của nút "Mua ngay" và icon giỏ hàng trên Header bằng `getBoundingClientRect()`.
2.  Dùng `framer-motion` để animate một thẻ `div` nhỏ từ tọa độ A đến B với đường cong Bezier.

---

### Kết luận:
Để đạt được độ mượt như Apple, hãy tập trung vào:
1.  **Ease-in-out**: Luôn dùng các hàm chuyển động tự nhiên.
2.  **Border Radius**: Bo góc mạnh (`rounded-3xl` hoặc `rounded-[2.5rem]`).
3.  **Soft Shadows**: Thay vì đổ bóng đen, hãy dùng `shadow-slate-200/50`.
