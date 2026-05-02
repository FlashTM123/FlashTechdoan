<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class RevenueWidget extends StatsOverviewWidget
{
    protected ?string $pollingInterval = '30s';

    public static function canView(): bool
    {
        return auth()->user()->isStaff();
    }

    protected function getStats(): array
    {
        // Tổng doanh thu từ các đơn hàng đã hoàn thành
        $totalRevenue = Order::where('order_status', 'delivered')
            ->sum('total_amount');

        // Số đơn hàng mới trong 24h qua
        $newOrders24h = Order::where('created_at', '>=', now()->subHours(24))
            ->count();

        // Số đơn đang chờ xử lý
        $pendingOrders = Order::where('order_status', 'pending')->count();

        // Doanh thu hôm nay
        $todayRevenue = Order::where('order_status', 'delivered')
            ->whereDate('created_at', today())
            ->sum('total_amount');

        return [
            Stat::make('Tổng doanh thu', number_format($totalRevenue, 0, ',', '.') . ' ₫')
                ->description('Từ các đơn đã hoàn thành')
                ->descriptionIcon('heroicon-m-banknotes')
                ->color('success')
                ->chart(
                    Order::where('order_status', 'delivered')
                        ->where('created_at', '>=', now()->subDays(7))
                        ->selectRaw('DATE(created_at) as date, SUM(total_amount) as total')
                        ->groupBy('date')
                        ->orderBy('date')
                        ->pluck('total')
                        ->toArray()
                ),

            Stat::make('Đơn hàng mới (24h)', $newOrders24h . ' đơn')
                ->description('So với hôm qua')
                ->descriptionIcon('heroicon-m-shopping-bag')
                ->color('primary')
                ->chart(
                    collect(range(6, 0))->map(fn ($d) =>
                        Order::whereDate('created_at', today()->subDays($d))->count()
                    )->toArray()
                ),

            Stat::make('Đang chờ xử lý', $pendingOrders . ' đơn')
                ->description('Cần được xử lý ngay')
                ->descriptionIcon('heroicon-m-clock')
                ->color($pendingOrders > 10 ? 'danger' : 'warning'),

            Stat::make('Doanh thu hôm nay', number_format($todayRevenue, 0, ',', '.') . ' ₫')
                ->description(today()->format('d/m/Y'))
                ->descriptionIcon('heroicon-m-calendar-days')
                ->color('info'),
        ];
    }
}
