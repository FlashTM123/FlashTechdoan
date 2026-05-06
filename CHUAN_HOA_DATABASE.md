# 🛠️ Hướng dẫn Chuẩn hóa Database cho FlashTech

Tài liệu này hướng dẫn cách chuyển đổi từ việc lưu thông số kỹ thuật dạng **JSON** sang **Bảng quan hệ (1-N)** để tối ưu hóa hiệu suất và khả năng lọc (filtering).

---

## 1. Migration: Tạo bảng `product_variant_details`

Bạn cần chạy lệnh tạo bảng mới và xóa cột cũ. Hãy tạo một file migration mới:

```php
// database/migrations/2024_05_06_create_product_variant_details_table.php

public function up()
{
    // 1. Tạo bảng con để lưu thông số chi tiết
    Schema::create('product_variant_details', function (Blueprint $table) {
        $table->id();
        $table->foreignId('product_variant_id')->constrained()->onDelete('cascade');
        $table->string('attribute_name');  // Ví dụ: RAM, CPU, SSD
        $table->string('attribute_value'); // Ví dụ: 16GB, i7-12700H, 512GB
        $table->timestamps();
    });

    // 2. Xóa cột specifications (JSON) ở bảng variants (Sau khi đã backup dữ liệu)
    Schema::table('product_variants', function (Blueprint $table) {
        $table->dropColumn('specifications');
    });
}
```

---

## 2. Eloquent Relationship (Model)

Trong file `app/Models/ProductVariant.php`, hãy định nghĩa quan hệ để Laravel hiểu cách lấy dữ liệu:

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    // ... các code khác ...

    /**
     * Lấy tất cả thông số kỹ thuật của biến thể này
     */
    public function details()
    {
        return $this->hasMany(ProductVariantDetail::class);
    }
}
```

---

## 3. Controller Logic (Eager Loading)

Khi lấy thông tin sản phẩm, bạn cần lấy kèm theo các "details" của từng biến thể để tránh lỗi N+1 Query.

```php
// app/Http/Controllers/ProductController.php

public function show($id)
{
    // Sử dụng 'variants.details' để lấy sâu 2 tầng dữ liệu
    $product = Product::with(['variants.details', 'category'])
                      ->findOrFail($id);

    return Inertia::render('Products/ProductDetail', [
        'product' => $product
    ]);
}
```

---

## 4. React Frontend (Hiển thị bảng thông số)

Trong file `ProductDetail.tsx`, chúng ta sẽ dùng vòng lặp `.map()` để hiển thị mảng `details`.

```tsx
{/* Phần hiển thị thông số kỹ thuật */}
<div className="mt-8 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
    <table className="w-full text-left border-collapse">
        <thead>
            <tr className="bg-slate-50 dark:bg-slate-800">
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Thông số</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Chi tiết</th>
            </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
            {selectedVariant.details && selectedVariant.details.length > 0 ? (
                selectedVariant.details.map((detail: any) => (
                    <tr key={detail.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-bold text-slate-600">{detail.attribute_name}</td>
                        <td className="px-6 py-4 text-sm text-slate-800">{detail.attribute_value}</td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={2} className="px-6 py-8 text-center text-slate-400 italic">
                        Chưa có thông số kỹ thuật cho biến thể này.
                    </td>
                </tr>
            )}
        </tbody>
    </table>
</div>
```

---

## 5. Filament Admin Update (Trang Quản trị)

Khi bạn xóa cột `specifications` cũ, trang Admin sẽ bị lỗi. Hãy cập nhật file `app/Filament/Resources/Products/ProductResource.php`:

```php
// Tìm đoạn Repeater của specifications và sửa thành:

Repeater::make('details') // Đổi từ 'specifications' sang 'details'
    ->relationship()      // QUAN TRỌNG: Kết nối với bảng quan hệ chi tiết
    ->label('Thông số kỹ thuật chi tiết')
    ->schema([
        TextInput::make('attribute_name') // Đổi 'key' thành 'attribute_name'
            ->label('Tên thuộc tính')
            ->placeholder('VD: CPU, RAM')
            ->required(),
        TextInput::make('attribute_value') // Đổi 'value' thành 'attribute_value'
            ->label('Giá trị chi tiết')
            ->placeholder('VD: i7 12700H, 16GB')
            ->required(),
    ])
    ->columns(2)
    ->columnSpanFull()
```

---

## 6. Tại sao cách này tối ưu hơn cho việc Lọc (Filtering)?

Khi bảo vệ đồ án, bạn hãy giải thích với thầy 3 ý chính sau:

1.  **Tốc độ truy vấn (Performance):** SQL có thể tìm kiếm cực nhanh trên các cột `attribute_name` và `attribute_value` bằng lệnh `WHERE`. Nếu dùng JSON, Database phải đọc từng dòng (Full Table Scan), rất chậm khi dữ liệu lớn.
2.  **Đánh chỉ mục (Indexing):** Chúng ta có thể tạo `INDEX` cho cột `attribute_value`. Điều này giúp việc lọc "Tất cả laptop có RAM 16GB" diễn ra gần như ngay lập tức.
3.  **Tính toàn vẹn (Data Integrity):** Việc tách bảng giúp tránh việc nhập sai cấu trúc JSON (thiếu ngoặc, sai key), đảm bảo dữ liệu luôn nhất quán và dễ dàng báo cáo thống kê.
