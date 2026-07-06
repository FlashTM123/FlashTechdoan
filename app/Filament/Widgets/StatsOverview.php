<?php

namespace App\Filament\Widgets;

use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use App\Models\Product;
use App\Models\User;
use App\Models\Order;

class StatsOverview extends StatsOverviewWidget
{
    protected static ?int $sort = 10;
    protected int|string|array $columnSpan = 'full';

    // Tự tải lại sau mỗi 30 giây
    protected ?string $pollingInterval = '30s';

    protected function getStats(): array
    {
        $totalOrders = Order::count();

        // Sparkline 7 ngày cho đơn hàng
        $orderSparkline = collect(range(6, 0))
            ->map(fn ($d) => Order::whereDate('created_at', today()->subDays($d))->count())
            ->toArray();

        // Sparkline 7 ngày cho sản phẩm (tích lũy)
        $productSparkline = collect(range(6, 0))
            ->map(fn ($d) => Product::whereDate('created_at', '<=', today()->subDays($d))->count())
            ->toArray();

        $orderStat = Stat::make('Tổng đơn hàng', number_format($totalOrders))
            ->description('Tất cả đơn đã tạo')
            ->descriptionIcon('heroicon-m-shopping-bag')
            ->color('primary');

        // Chỉ hiển thị biểu đồ nếu dữ liệu có sự biến động (tránh vẽ vạch ngang thẳng đuột xấu)
        if (count(array_unique($orderSparkline)) > 1) {
            $orderStat->chart($orderSparkline);
        }

        $productStat = Stat::make('Tổng số sản phẩm', Product::count())
            ->description('Tất cả cấu hình trong kho')
            ->descriptionIcon('heroicon-m-computer-desktop')
            ->color('success');

        if (count(array_unique($productSparkline)) > 1) {
            $productStat->chart($productSparkline);
        }

        return [
            $orderStat
                ->url('/admin/orders'),

            $productStat
                ->url('/admin/products'),

            Stat::make('Tổng khách hàng', User::where('role', 'customer')->count())
                ->description('Tài khoản đã đăng ký')
                ->descriptionIcon('heroicon-m-user-group')
                ->color('info')
                ->url('/admin/customers'),
        ];
    }
}
