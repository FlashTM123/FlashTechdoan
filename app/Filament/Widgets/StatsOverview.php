<?php

namespace App\Filament\Widgets;

use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use App\Models\Product;
use App\Models\User;
use App\Models\Review;

class StatsOverview extends StatsOverviewWidget
{
    // Tự tải lại sau mỗi 30 giây
    protected ?string $pollingInterval = '30s';
    protected function getStats(): array
    {
        return [
            Stat::make('Tổng số Sản phẩm', Product::count())
                ->description('Tất cả cấu hình trong kho')
                ->descriptionIcon('heroicon-m-computer-desktop')
                ->color('success'),

            Stat::make('Tổng khách hàng', User::where('role', 'customer')->count())
                ->description('Tài khoản đã đăng ký')
                ->descriptionIcon('heroicon-m-user-group')
                ->color('info'),

            Stat::make('Đánh giá mới', Review::where('is_visible', false)->count())
                ->description('Đang chờ phê duyệt')
                ->descriptionIcon('heroicon-m-chat-bubble-left-right')
                ->color('warning'),
            /* CODE DỰ PHÒNG CHO ORDERS SAU NÀY
            Stat::make('Doanh thu', '0đ')
                ->description('Sau khi làm bảng Orders')
                ->descriptionIcon('heroicon-m-banknotes')
                ->color('primary'),
            */
        ];
    }
}
