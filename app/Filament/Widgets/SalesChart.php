<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Carbon;

class SalesChart extends ChartWidget
{
    protected ?string $heading = 'Doanh thu theo thời gian';
    protected ?string $pollingInterval = '60s';

    public static function canView(): bool
    {
        return auth()->user()->isStaff();
    }

    // Mặc định chọn "Tháng này"
    public ?string $filter = 'month';

    /**
     * Cung cấp các bộ lọc thời gian cho Admin lựa chọn.
     */
    protected function getFilters(): ?array
    {
        return [
            'week'  => 'Tuần này',
            'month' => 'Tháng này',
            'year'  => 'Năm nay',
        ];
    }

    /**
     * Truy vấn dữ liệu doanh thu tùy theo bộ lọc đang chọn.
     */
    protected function getData(): array
    {
        [$labels, $data] = match ($this->filter) {
            'week'  => $this->getWeekData(),
            'year'  => $this->getYearData(),
            default => $this->getMonthData(),
        };

        return [
            'datasets' => [
                [
                    'label'           => 'Doanh thu (₫)',
                    'data'            => $data,
                    'borderColor'     => '#F59E0B',       // Màu vàng cam đặc trưng FlashTech
                    'backgroundColor' => 'rgba(245, 158, 11, 0.15)',
                    'fill'            => true,
                    'tension'         => 0.4,             // Đường cong mượt
                    'pointBackgroundColor' => '#F59E0B',
                    'pointRadius'     => 4,
                    'pointHoverRadius' => 6,
                ],
            ],
            'labels' => $labels,
        ];
    }

    /**
     * Dữ liệu theo từng ngày trong TUẦN này (T2 → CN).
     */
    private function getWeekData(): array
    {
        $labels = [];
        $data   = [];

        // Lấy từ đầu tuần (Monday) đến hôm nay
        $start = Carbon::now()->startOfWeek();

        for ($i = 0; $i <= 6; $i++) {
            $day = $start->copy()->addDays($i);
            $labels[] = $day->format('D d/m'); // VD: Mon 28/04
            $data[] = (float) Order::where('order_status', 'delivered')
                ->whereDate('created_at', $day)
                ->sum('total_amount');
        }

        return [$labels, $data];
    }

    /**
     * Dữ liệu theo từng ngày trong THÁNG hiện tại.
     */
    private function getMonthData(): array
    {
        $labels = [];
        $data   = [];

        $daysInMonth = Carbon::now()->daysInMonth;

        for ($day = 1; $day <= $daysInMonth; $day++) {
            $date = Carbon::now()->setDay($day);
            $labels[] = $day . '/' . Carbon::now()->format('m');
            $data[] = (float) Order::where('order_status', 'delivered')
                ->whereDate('created_at', $date->toDateString())
                ->sum('total_amount');
        }

        return [$labels, $data];
    }

    /**
     * Dữ liệu theo từng THÁNG trong năm hiện tại.
     */
    private function getYearData(): array
    {
        $labels = ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'];
        $data   = [];

        for ($month = 1; $month <= 12; $month++) {
            $data[] = (float) Order::where('order_status', 'delivered')
                ->whereYear('created_at', Carbon::now()->year)
                ->whereMonth('created_at', $month)
                ->sum('total_amount');
        }

        return [$labels, $data];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
