<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $today = now()->startOfDay();
        $yesterday = now()->subDay()->startOfDay();
        $thirtyDaysAgo = now()->subDays(30)->startOfDay();

        // ─── Stat Cards ────────────────────────────────────────────────
        $totalOrders = Order::count();
        $totalProducts = Product::count();
        $totalCustomers = User::where('role', 'customer')->count();
        $pendingReviews = Review::where('status', 'pending')->count();

        $totalRevenue = Order::where('order_status', 'delivered')
            ->sum('total_amount');

        $newOrdersToday = Order::where('created_at', '>=', $today)->count();
        $newOrdersYesterday = Order::where('created_at', '>=', $yesterday)
            ->where('created_at', '<', $today)->count();

        $pendingOrders = Order::where('order_status', 'pending')->count();

        $revenueToday = Order::where('order_status', 'delivered')
            ->where('created_at', '>=', $today)
            ->sum('total_amount');

        // ─── Biểu đồ doanh thu 30 ngày ────────────────────────────────
        $revenueChart = Order::where('order_status', 'delivered')
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(total_amount) as revenue'),
                DB::raw('COUNT(*) as orders')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn($row) => [
                'date'    => $row->date,
                'revenue' => (float) $row->revenue,
                'orders'  => (int) $row->orders,
            ]);

        // ─── Đơn hàng theo trạng thái ─────────────────────────────────
        $ordersByStatus = Order::select('order_status', DB::raw('count(*) as total'))
            ->groupBy('order_status')
            ->get()
            ->mapWithKeys(fn($row) => [$row->order_status => $row->total]);

        // ─── Top 5 sản phẩm bán chạy ─────────────────────────────────
        $topProducts = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.order_status', 'delivered')
            ->select(
                'products.id',
                'products.name',
                DB::raw('SUM(order_items.quantity) as total_sold'),
                DB::raw('SUM(order_items.quantity * order_items.unit_price) as revenue')
            )
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('total_sold')
            ->limit(5)
            ->get();

        // ─── Đơn hàng gần đây ─────────────────────────────────────────
        $recentOrders = Order::with(['user'])
            ->latest()
            ->take(8)
            ->get()
            ->map(fn($order) => [
                'id'           => $order->id,
                'order_code'   => $order->order_code,
                'customer'     => $order->user?->name ?? 'Khách',
                'total_amount' => (float) $order->total_amount,
                'order_status' => $order->order_status,
                'created_at'   => $order->created_at->format('d/m/Y H:i'),
            ]);

        return Inertia::render('Dashboard', [
            'stats' => [
                'totalOrders'        => $totalOrders,
                'totalProducts'      => $totalProducts,
                'totalCustomers'     => $totalCustomers,
                'pendingReviews'     => $pendingReviews,
                'totalRevenue'       => (float) $totalRevenue,
                'newOrdersToday'     => $newOrdersToday,
                'newOrdersYesterday' => $newOrdersYesterday,
                'pendingOrders'      => $pendingOrders,
                'revenueToday'       => (float) $revenueToday,
            ],
            'revenueChart'   => $revenueChart,
            'ordersByStatus' => $ordersByStatus,
            'topProducts'    => $topProducts,
            'recentOrders'   => $recentOrders,
        ]);
    }
}
