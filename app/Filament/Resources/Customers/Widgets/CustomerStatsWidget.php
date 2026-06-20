<?php

namespace App\Filament\Resources\Customers\Widgets;

use App\Models\User;
use App\Models\Order;
use App\Models\UserProfile;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class CustomerStatsWidget extends StatsOverviewWidget
{
    protected static ?int $sort = 1;
    protected int|string|array $columnSpan = 'full';
    protected ?string $pollingInterval = '30s';

    protected function getStats(): array
    {
        $totalCustomers = User::where('role', 'customer')->count();
        $activeCustomers = User::where('role', 'customer')->where('is_active', true)->count();
        $lockedCustomers = User::where('role', 'customer')->where('is_active', false)->count();

        // Khách hàng mới trong 30 ngày
        $newThisMonth = User::where('role', 'customer')
            ->where('created_at', '>=', now()->subDays(30))
            ->count();

        // Sparkline 7 ngày khách hàng mới
        $newCustomerSparkline = collect(range(6, 0))
            ->map(fn($d) => User::where('role', 'customer')
                ->whereDate('created_at', today()->subDays($d))
                ->count())
            ->toArray();

        // Tổng điểm tích lũy
        $totalPoints = UserProfile::whereHas('user', fn($q) => $q->where('role', 'customer'))
            ->sum('points');

        // Điểm trung bình
        $avgPoints = $totalCustomers > 0
            ? round(UserProfile::whereHas('user', fn($q) => $q->where('role', 'customer'))->avg('points') ?? 0)
            : 0;

        // Tổng doanh thu từ khách hàng
        $totalRevenue = Order::whereHas('user', fn($q) => $q->where('role', 'customer'))
            ->whereIn('order_status', ['delivered', 'completed'])
            ->sum('total_amount');

        $totalCustomerStat = Stat::make('👥 Tổng khách hàng', number_format($totalCustomers))
            ->description("+{$newThisMonth} mới trong 30 ngày")
            ->descriptionIcon('heroicon-m-user-plus')
            ->color('primary');

        if (count(array_unique($newCustomerSparkline)) > 1) {
            $totalCustomerStat->chart($newCustomerSparkline);
        }

        return [
            $totalCustomerStat,

            Stat::make('✅ Đang hoạt động', number_format($activeCustomers))
                ->description($lockedCustomers . ' tài khoản bị khóa')
                ->descriptionIcon('heroicon-m-check-circle')
                ->color('success'),

            Stat::make('🏆 Điểm tích lũy TB', number_format($avgPoints))
                ->description('Tổng: ' . number_format($totalPoints) . ' điểm')
                ->descriptionIcon('heroicon-m-trophy')
                ->color('warning'),

            Stat::make('💰 Doanh thu từ KH', '₫' . number_format($totalRevenue))
                ->description('Đơn hoàn thành')
                ->descriptionIcon('heroicon-m-banknotes')
                ->color('info'),
        ];
    }
}
