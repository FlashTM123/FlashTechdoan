<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class RevenueWidget extends StatsOverviewWidget
{
    protected static ?int $sort = 20;
    protected int|string|array $columnSpan = 'full';
    protected ?string $pollingInterval = '30s';

    public static function canView(): bool
    {
        // BUG 4 FIX: cho phép cả employee xem widget doanh thu
        return auth()->user()?->canAccessPanel(app(\Filament\Panel::class)) ?? false;
    }

    protected function getStats(): array
    {
        $totalRevenue  = Order::where('order_status', 'delivered')->sum('total_amount');
        $newOrders24h  = Order::where('created_at', '>=', now()->subHours(24))->count();
        $newOrdersYest = Order::whereBetween('created_at', [now()->subDays(2)->startOfDay(), now()->subDay()->endOfDay()])->count();
        $pendingOrders = Order::where('order_status', 'pending')->count();
        $todayRevenue  = Order::where('order_status', 'delivered')->whereDate('created_at', today())->sum('total_amount');

        // So sánh đơn mới hôm nay vs hôm qua
        $trendIcon  = $newOrders24h >= $newOrdersYest ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-arrow-trending-down';
        $trendColor = $newOrders24h >= $newOrdersYest ? 'success' : 'danger';
        $trendLabel = $newOrdersYest > 0
            ? abs(round(($newOrders24h - $newOrdersYest) / $newOrdersYest * 100)) . '% so hôm qua'
            : 'So với hôm qua';

        // Helper format tiền gọn: 57.720.000 → 57,7tr
        $formatMoney = fn ($amount) => $amount >= 1_000_000
            ? number_format($amount / 1_000_000, 1, '.', '') . ' tr ₫'
            : number_format($amount, 0, ',', '.') . ' ₫';

        // Helper: format tiền gọn, không bị xuống dòng
        $formatMoney = function ($amount) {
            if ($amount >= 1_000_000_000) {
                return number_format($amount / 1_000_000_000, 1) . ' tỷ ₫';
            }
            if ($amount >= 1_000_000) {
                return number_format($amount / 1_000_000, 1) . ' tr ₫';
            }
            return number_format($amount, 0, ',', '.') . ' ₫';
        };

        // Ngày hôm nay tiếng Việt
        $days = ['Chủ nhật','Thứ 2','Thứ 3','Thứ 4','Thứ 5','Thứ 6','Thứ 7'];
        $todayLabel = $days[today()->dayOfWeek] . ', ' . today()->format('d/m/Y');

        // Điền đủ 7 ngày (k\u1ec3 c\u1ea3 ng\u00e0y kh\u00f4ng c\u00f3 \u0111\u01a1n \u2192 gi\u00e1 tr\u1ecb 0), tr\u00e1nh l\u1ec7ch \u0111i\u1ec3m bi\u1ec3u \u0111\u1ed3
        $revenueChartData = collect(range(6, 0))->map(fn ($d) =>
            (float) Order::where('order_status', 'delivered')
                ->whereDate('created_at', today()->subDays($d))
                ->sum('total_amount')
        )->toArray();

        $newOrdersChartData = collect(range(6, 0))->map(fn ($d) =>
            Order::whereDate('created_at', today()->subDays($d))->count()
        )->toArray();

        $totalRevenueStat = Stat::make('Tổng doanh thu', $formatMoney($totalRevenue))
            ->description('Từ các đơn đã hoàn thành')
            ->descriptionIcon('heroicon-m-banknotes')
            ->color('success');

        if (!empty($revenueChartData) && count(array_unique($revenueChartData)) > 1) {
            $totalRevenueStat->chart($revenueChartData);
        }

        $newOrdersStat = Stat::make('Đơn hàng mới (24h)', $newOrders24h . ' đơn')
            ->description($trendLabel)
            ->descriptionIcon($trendIcon)
            ->color($trendColor);

        if (count(array_unique($newOrdersChartData)) > 1) {
            $newOrdersStat->chart($newOrdersChartData);
        }

        return [
            $totalRevenueStat,
            $newOrdersStat,

            Stat::make('Đang chờ xử lý', $pendingOrders . ' đơn')
                ->description($pendingOrders > 0 ? 'Cần được xử lý ngay' : 'Không có đơn chờ')
                ->descriptionIcon($pendingOrders > 0 ? 'heroicon-m-exclamation-triangle' : 'heroicon-m-check-circle')
                ->color($pendingOrders > 10 ? 'danger' : ($pendingOrders > 0 ? 'warning' : 'success')),

            Stat::make('Doanh thu hôm nay', $formatMoney($todayRevenue))
                ->description($todayLabel)
                ->descriptionIcon('heroicon-m-calendar-days')
                ->color($todayRevenue > 0 ? 'success' : 'gray'),
        ];
    }
}
