# Hướng dẫn: Tự động đổi Ảnh Sản phẩm theo Biến thể Màu sắc

Tài liệu này hướng dẫn bạn cách thiết lập hệ thống ảnh sản phẩm đa dạng, cho phép giao diện tự động cập nhật hình ảnh khi người dùng chọn các màu sắc hoặc phiên bản khác nhau.

## 1. Thiết kế Database

Bạn cần một bảng để lưu trữ nhiều hình ảnh cho một sản phẩm và liên kết chúng với các biến thể cụ thể.

### Migration: `create_product_images_table`

```php
Schema::create('product_images', function (Blueprint $table) {
    $table->id();
    $table->foreignId('product_id')->constrained()->onDelete('cascade');
    
    // Liên kết với biến thể (có thể null nếu là ảnh chung của sản phẩm)
    $table->foreignId('product_variant_id')->nullable()->constrained()->onDelete('cascade');
    
    $table->string('image_url');
    $table->integer('display_order')->default(0);
    $table->boolean('is_primary')->default(false); // Ảnh chính của biến thể/sản phẩm
    $table->timestamps();
});
```

---

## 2. Laravel Backend: Model & Eager Loading

Thiết lập mối quan hệ trong Model để dễ dàng lấy dữ liệu.

### Product Model (`app/Models/Product.php`)
```php
public function images() {
    return $this->hasMany(ProductImage::class);
}

public function variants() {
    return $this->hasMany(ProductVariant::class);
}
```

### ProductVariant Model (`app/Models/ProductVariant.php`)
```php
public function images() {
    return $this->hasMany(ProductImage::class, 'product_variant_id');
}
```

### Lấy dữ liệu trong Controller
Sử dụng **Eager Loading** để lấy toàn bộ dữ liệu trong 1 câu query duy nhất:
```php
$product = Product::with(['images', 'variants.images'])->findOrFail($id);
```

---

## 3. React Logic (React 19)

Trong React, chúng ta sẽ quản lý biến thể đang được chọn (`selectedVariant`) và tự động tính toán ảnh hiển thị.

```tsx
import { useState, useMemo } from 'react';

const ProductDetail = ({ product }) => {
    // 1. State quản lý biến thể đang chọn
    const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);

    // 2. Logic tính toán ảnh hiển thị (useMemo để tối ưu)
    const activeImage = useMemo(() => {
        // Ưu tiên lấy ảnh đầu tiên của biến thể đang chọn
        if (selectedVariant?.images?.length > 0) {
            return selectedVariant.images[0].image_url;
        }
        // Fallback: Nếu màu đó không có ảnh riêng, dùng ảnh mặc định của sản phẩm
        return product.thumbnail_url;
    }, [selectedVariant, product.thumbnail_url]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Gallery Section */}
            <div className="relative overflow-hidden rounded-xl bg-gray-100 aspect-square">
                <img 
                    src={activeImage} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
                    key={activeImage} // Key giúp React trigger animation khi đổi ảnh
                />
            </div>

            {/* Selection Section */}
            <div>
                <h3 className="text-lg font-bold">Chọn màu sắc:</h3>
                <div className="flex gap-3 mt-3">
                    {product.variants.map((variant) => (
                        <button
                            key={variant.id}
                            onClick={() => setSelectedVariant(variant)}
                            className={`p-2 border-2 rounded-lg ${
                                selectedVariant.id === variant.id ? 'border-blue-500' : 'border-gray-200'
                            }`}
                        >
                            {variant.variant_name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
```

---

## 4. UI/UX: Hiệu ứng chuyển ảnh mượt mà

Để việc đổi ảnh không bị "khựng", bạn nên kết hợp CSS Transition hoặc các thư viện animation.

### Kỹ thuật dùng CSS thuần:
Trong đoạn code trên, tôi đã thêm `key={activeImage}` vào tag `<img>`. Khi `activeImage` thay đổi, React sẽ coi đó là một element mới và thực hiện re-mount. Bạn có thể kết hợp với CSS:

```css
/* Trong file CSS của bạn */
.image-fade {
    animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
    from { opacity: 0; transform: scale(1.05); }
    to { opacity: 1; transform: scale(1); }
}
```

---

## 5. Xử lý Fallback Logic (Giải thích chi tiết)

Trong thực tế, không phải lúc nào bạn cũng có đủ ảnh cho mọi màu sắc. Hệ thống cần hoạt động thông minh theo thứ tự ưu tiên:

1.  **Ưu tiên 1**: Ảnh có `product_variant_id` trùng với ID đang chọn.
2.  **Ưu tiên 2**: Nếu không tìm thấy, lấy ảnh chung của sản phẩm (có `product_variant_id` là `null`).
3.  **Ưu tiên 3**: Nếu vẫn không có, dùng ảnh `thumbnail_url` (đã khai báo trong bảng `products`).

**Đoạn code xử lý mẫu trong Laravel (nếu bạn muốn xử lý từ Backend):**
```php
public function getDisplayImageAttribute() {
    return $this->images()->where('product_variant_id', $this->current_variant_id)->first() 
           ?? $this->images()->whereNull('product_variant_id')->first() 
           ?? $this->thumbnail_url;
}
```
