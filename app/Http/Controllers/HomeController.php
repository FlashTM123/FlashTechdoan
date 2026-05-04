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
            $q->where('is_active', true)->with('variants')->latest()->take(4);
        }])
            ->whereHas('products') // Chỉ lấy danh mục nào thực sự có hàng
            ->get();

        return inertia('Home', [
            'featured_products' => Product::with('variants')->where('is_featured', true)->take(4)->get(),
            'sections' => $categories_with_products, // Đổi tên thành sections cho dễ hiểu
        ]);
    }


    public function show($id)
    {
        // Tìm sản phẩm kèm biến thể
        $product = Product::with('variants')->findOrFail($id);
        return inertia('Products/ProductDetail', [
            'product' => $product
        ]);
    }
    public function product(Request $request)
    {
      $products = Product::query()
      ->with('variants')
      ->where('is_active', true)
      ->when($request->category, function ($query, $slug){
            $query->whereHas('category', fn($q) => $q->where('slug', $slug));
      })
      ->latest()
      ->get();

      return inertia('Product', [
          'products' => $products
      ]);
    }
}
