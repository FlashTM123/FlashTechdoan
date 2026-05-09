# 📦 Hướng dẫn Xây dựng Hệ thống Sản phẩm (List & Detail)

Tài liệu này hướng dẫn cách triển khai trang danh sách và chi tiết sản phẩm với logic lọc dữ liệu và chọn biến thể chuyên nghiệp.

---

## 1. Backend: Eager Loading Dữ liệu
Để tối ưu hiệu suất và tránh lỗi N+1, luôn sử dụng `with()` khi lấy dữ liệu sản phẩm.

```php
// app/Http/Controllers/HomeController.php

public function product(Request $request)
{
    $query = Product::query()->with(['brand', 'variants', 'images']);

    // 1. Lọc theo thương hiệu
    if ($request->has('brand')) {
        $query->whereHas('brand', function($q) use ($request) {
            $q->where('slug', $request->brand);
        });
    }

    // 2. Lọc theo giá (Lọc trên bảng variants vì giá nằm ở đó)
    if ($request->has('min_price')) {
        $query->whereHas('variants', function($q) use ($request) {
            $q->where('price', '>=', $request->min_price);
        });
    }

    $products = $query->latest()->paginate(12);

    return Inertia::render('Products/Index', [
        'products' => $products,
        'filters' => $request->only(['brand', 'min_price', 'max_price']),
    ]);
}
```

---

## 2. Frontend: Logic Chọn Biến thể (Product Detail)
Trong trang `ProductDetail.tsx`, chúng ta sử dụng `useState` để quản lý biến thể đang chọn.

### Mẫu Code Logic:
```javascript
// Khởi tạo state với biến thể đầu tiên
const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null);

// Hàm định dạng giá tiền
const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

// Hiển thị trong JSX
<h2 className="text-3xl font-bold">
    {formatPrice(selectedVariant?.price || product.base_price)}
</h2>

// Nút chọn cấu hình
{product.variants.map((variant) => (
    <button 
        key={variant.id}
        onClick={() => setSelectedVariant(variant)}
        className={`p-4 border-2 ${selectedVariant.id === variant.id ? 'border-indigo-600' : 'border-slate-200'}`}
    >
        {variant.variant_name}
    </button>
))}
```

---

## 3. Frontend: Bộ lọc Sản phẩm (Product Index)
Sử dụng `router.get` của Inertia để gửi các tham số lọc về Server mà không làm tải lại trang.

### Mẫu Code Filter:
```javascript
import { router } from '@inertiajs/react';

const handleFilter = (brandSlug) => {
    router.get(route('products.index'), { brand: brandSlug }, {
        preserveState: true,
        preserveScroll: true,
        replace: true
    });
};
```

---

## 4. Lưu ý về Hình ảnh
Luôn xử lý đường dẫn hình ảnh linh hoạt giữa URL tuyệt đối (từ seeder) và URL nội bộ (từ storage).

```javascript
const getImageUrl = (path) => {
    if (!path) return '/placeholder.png';
    return path.startsWith('http') ? path : `/storage/${path}`;
};
```
