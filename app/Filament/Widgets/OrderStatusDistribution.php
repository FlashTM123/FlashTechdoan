<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Facades\DB;

class OrderStatusDistribution extends ChartWidget
{
    protected static ?int $sort = 35;
    protected int|string|array $columnSpan = 1;

    protected ?string $heading = 'Phân bố trạng thái đơn hàng';
    protected ?string $pollingInterval = '60s';

    protected function getData(): array
    {
        $statusCounts = Order::select('order_status', DB::raw('count(*) as total'))
            ->groupBy('order_status')
            ->pluck('total', 'order_status')
            ->toArray();

        $statusLabels = [
            'pending'    => 'Chờ xử lý',
            'processing' => 'Đóng gói',
            'shipped'    => 'Đang giao',
            'delivered'  => 'Đã giao',
            'cancelled'  => 'Đã hủy',
        ];

        $colors = [
            'pending'    => '#FBBF24',
            'processing' => '#3B82F6',
            'shipped'    => '#8B5CF6',
            'delivered'  => '#10B981',
            'cancelled'  => '#EF4444',
        ];

        $labels = [];
        $data = [];
        $backgroundColor = [];

        foreach ($statusLabels as $key => $label) {
            $labels[] = $label;
            $data[] = $statusCounts[$key] ?? 0;
            $backgroundColor[] = $colors[$key];
        }

        return [
            'datasets' => [
                [
                    'label' => 'Số đơn hàng',
                    'data' => $data,
                    'backgroundColor' => $backgroundColor,
                    'borderColor' => '#ffffff',
                    'borderWidth' => 2,
                ],
            ],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        return 'doughnut';
    }
}
