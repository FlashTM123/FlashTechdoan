<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;

use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index()
    {
        // Lấy các danh mục có sản phẩm, kèm theo tối đa 4 sản phẩm mỗi loại
        $categories_with_products = Category::with(['products' => function ($q) {
            $q->where('is_active', true)->with('variants.details')->latest()->take(4);
        }])
        ->withCount('products') // Đếm số sản phẩm trong mỗi danh mục
            ->whereHas('products') // Chỉ lấy danh mục nào thực sự có hàng
            ->get();

        return inertia('Home', [
            'featured_products' => Product::with('variants.details')->where('is_featured', true)->take(4)->get(),
            'sections' => $categories_with_products, // Đổi tên thành sections cho dễ hiểu
        ]);
    }


    public function show($id)
    {
        // Tìm sản phẩm kèm biến thể, chi tiết thông số và hình ảnh
        $product = Product::with([
            'variants.details',
            'variants.images',
            'images',
            'category'
        ])->findOrFail($id);

        return inertia('Products/ProductDetail', [
            'product' => $product
        ]);
    }
    public function product(Request $request)
    {
        $query = Product::query()
            ->with(['brand', 'variants.details', 'images'])
            ->where('is_active', true);

        // Lọc theo Danh mục
        if ($request->category) {
            $query->whereHas('category', fn($q) => $q->where('slug', $request->category));
        }

        // Lọc theo Thương hiệu
        if ($request->brand) {
            $query->whereHas('brand', fn($q) => $q->where('slug', $request->brand));
        }

        // Lọc theo Khoảng giá (Lọc trên bảng variants)
        if ($request->min_price) {
            $query->whereHas('variants', fn($q) => $q->where('price', '>=', $request->min_price));
        }
        if ($request->max_price) {
            $query->whereHas('variants', fn($q) => $q->where('price', '<=', $request->max_price));
        }

        $products = $query->latest()->paginate(12)->withQueryString();

        return inertia('Products/Index', [
            'products' => $products,
            'brands' => \App\Models\Brand::all(),
            'categories' => Category::all(),
            'filters' => $request->all(),
        ]);
    }

    public function apiSearch(Request $request)
    {
        $query = $request->input('q');
        if (empty($query)) return response()->json([]);

        $products = Product::where('name', 'LIKE', "%{$query}%")
            ->where('is_active', true)
            ->with('variants')
            ->take(5)
            ->get();

        return response()->json($products);
    }
}
