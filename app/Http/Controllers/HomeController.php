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
        // Chỉ lấy các sản phẩm hoạt động và có thương hiệu đang hoạt động
        $categories_with_products = Category::with(['products' => function ($q) {
            $q->where('is_active', true)
              ->whereHas('brand', fn($b) => $b->where('is_active', true))
              ->with(['brand', 'category', 'variants.details'])
              ->latest()
              ->take(4);
        }])
        ->withCount(['products' => function ($q) {
            $q->where('is_active', true)
              ->whereHas('brand', fn($b) => $b->where('is_active', true));
        }]) // Đếm số sản phẩm đang hoạt động trong mỗi danh mục
        ->whereHas('products', function ($q) {
            $q->where('is_active', true)
              ->whereHas('brand', fn($b) => $b->where('is_active', true));
        }) // Chỉ lấy danh mục nào thực sự có hàng đang hoạt động
        ->get();

        return inertia('Home', [
            'featured_products' => Product::with(['brand', 'category', 'variants.details'])
                ->where('is_active', true)
                ->whereHas('brand', fn($b) => $b->where('is_active', true))
                ->where('is_featured', true)
                ->take(4)
                ->get(),
            'sections' => $categories_with_products,
        ]);
    }

    public function show($id)
    {
        // Tìm sản phẩm kèm biến thể, chi tiết thông số và hình ảnh
        // Chỉ cho phép xem nếu sản phẩm và thương hiệu của nó đang hoạt động
        $product = Product::where('is_active', true)
            ->whereHas('brand', fn($b) => $b->where('is_active', true))
            ->with([
                'variants.details',
                'variants.images',
                'images',
                'category',
                'brand'
            ])->findOrFail($id);

        return inertia('Products/ProductDetail', [
            'product' => $product
        ]);
    }

    public function product(Request $request)
    {
        $query = Product::query()
            ->with(['brand', 'category', 'variants.details', 'images'])
            ->where('is_active', true)
            ->whereHas('brand', fn($b) => $b->where('is_active', true));

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

        // Lọc theo từ khóa tìm kiếm
        if ($request->search) {
            $searchTerm = '%' . $request->search . '%';
            $query->where(function($q) use ($searchTerm) {
                $q->where('name', 'LIKE', $searchTerm)
                  ->orWhere('description', 'LIKE', $searchTerm);
            });
        }

        $products = $query->latest()->paginate(12)->withQueryString();

        return inertia('Products/Index', [
            'products' => $products,
            'brands' => \App\Models\Brand::where('is_active', true)->get(), // Chỉ hiển thị thương hiệu đang hoạt động trên sidebar
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
            ->whereHas('brand', fn($b) => $b->where('is_active', true))
            ->with(['brand', 'category', 'variants'])
            ->take(5)
            ->get();

        return response()->json($products);
    }
}
