<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Forms\Components\DatePicker;
use Filament\Schemas\Schema;
use Filament\Widgets\ChartWidget;
use Filament\Widgets\ChartWidget\Concerns\HasFiltersSchema;
use Illuminate\Support\Carbon;

class SalesChart extends ChartWidget
{
    use HasFiltersSchema;

    protected static ?int $sort = 30;
    protected int|string|array $columnSpan = 1;

    protected ?string $heading = 'Doanh thu theo thời gian';
    protected ?string $pollingInterval = '60s';

    public static function canView(): bool
    {
        return auth()->user()?->canAccessPanel(app(\Filament\Panel::class)) ?? false;
    }

    // Mặc định chọn "Tháng này"
    public ?string $filter = 'month';

    /**
     * Bộ lọc nhanh (dropdown).
     */
    protected function getFilters(): ?array
    {
        return [
            'week'   => 'Tuần này',
            'month'  => 'Tháng này',
            'year'   => 'Năm nay',
            'custom' => '📅 Tùy chọn ngày',
        ];
    }

    /**
     * Schema bộ lọc khoảng ngày tùy chọn (hiện ra trong dropdown filter icon khi chọn "Tùy chọn").
     */
    public function filtersSchema(Schema $schema): Schema
    {
        return $schema->components([
            DatePicker::make('dateFrom')
                ->label('Từ ngày')
                ->default(now()->subDays(30)->toDateString())
                ->maxDate(now()->toDateString())
                ->native(false)
                ->displayFormat('d/m/Y'),

            DatePicker::make('dateTo')
                ->label('Đến ngày')
                ->default(now()->toDateString())
                ->maxDate(now()->toDateString())
                ->native(false)
                ->displayFormat('d/m/Y'),
        ]);
    }

    /**
     * Truy vấn dữ liệu doanh thu tùy theo bộ lọc đang chọn.
     */
    protected function getData(): array
    {
        [$labels, $data] = match ($this->filter) {
            'week'   => $this->getWeekData(),
            'year'   => $this->getYearData(),
            'custom' => $this->getCustomData(),
            default  => $this->getMonthData(),
        };

        return [
            'datasets' => [
                [
                    'label'                => 'Doanh thu (₫)',
                    'data'                 => $data,
                    'borderColor'          => '#F59E0B',
                    'backgroundColor'      => 'rgba(245, 158, 11, 0.15)',
                    'fill'                 => true,
                    'tension'              => 0.4,
                    'pointBackgroundColor' => '#F59E0B',
                    'pointRadius'          => 4,
                    'pointHoverRadius'     => 6,
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
        $labels   = [];
        $data     = [];
        $dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

        $start = Carbon::now()->startOfWeek(Carbon::MONDAY);

        for ($i = 0; $i <= 6; $i++) {
            $day      = $start->copy()->addDays($i);
            $labels[] = $dayNames[$day->dayOfWeek] . ' ' . $day->format('d/m');
            $data[]   = (float) Order::where('order_status', 'delivered')
                ->whereDate('created_at', $day->toDateString())
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

        $now         = Carbon::now();
        $year        = $now->year;
        $month       = $now->month;
        $daysInMonth = $now->daysInMonth;

        for ($day = 1; $day <= $daysInMonth; $day++) {
            $date     = Carbon::create($year, $month, $day);
            $labels[] = $day . '/' . $month;
            $data[]   = (float) Order::where('order_status', 'delivered')
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

    /**
     * Dữ liệu theo KHOẢNG NGÀY TÙY CHỌN từ date range picker.
     * Tự động điều chỉnh granularity:
     *   ≤ 62 ngày  → hiển thị từng ngày
     *   ≤ 365 ngày → hiển thị từng tuần
     *   > 365 ngày → hiển thị từng tháng
     */
    private function getCustomData(): array
    {
        $labels = [];
        $data   = [];

        $filterData = $this->filters ?? [];

        $from = filled($filterData['dateFrom'] ?? null)
            ? Carbon::parse($filterData['dateFrom'])->startOfDay()
            : Carbon::now()->subDays(30)->startOfDay();

        $to = filled($filterData['dateTo'] ?? null)
            ? Carbon::parse($filterData['dateTo'])->endOfDay()
            : Carbon::now()->endOfDay();

        // Nếu from > to thì hoán đổi
        if ($from->gt($to)) {
            [$from, $to] = [$to, $from];
        }

        $diffDays = (int) $from->diffInDays($to);

        if ($diffDays <= 62) {
            // Từng ngày
            $current = $from->copy()->startOfDay();
            $end     = $to->copy()->startOfDay();
            while ($current->lte($end)) {
                $labels[] = $current->format('d/m');
                $data[]   = (float) Order::where('order_status', 'delivered')
                    ->whereDate('created_at', $current->toDateString())
                    ->sum('total_amount');
                $current->addDay();
            }
        } elseif ($diffDays <= 365) {
            // Từng tuần
            $current = $from->copy()->startOfWeek(Carbon::MONDAY);
            while ($current->lte($to)) {
                $weekEnd  = $current->copy()->endOfWeek();
                $labels[] = $current->format('d/m') . '–' . $weekEnd->format('d/m');
                $data[]   = (float) Order::where('order_status', 'delivered')
                    ->whereBetween('created_at', [
                        $current->copy()->startOfDay(),
                        $weekEnd->copy()->endOfDay(),
                    ])
                    ->sum('total_amount');
                $current->addWeek();
            }
        } else {
            // Từng tháng
            $current = $from->copy()->startOfMonth();
            while ($current->lte($to)) {
                $labels[] = 'T' . $current->month . '/' . $current->year;
                $data[]   = (float) Order::where('order_status', 'delivered')
                    ->whereYear('created_at', $current->year)
                    ->whereMonth('created_at', $current->month)
                    ->sum('total_amount');
                $current->addMonth();
            }
        }

        return [$labels, $data];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
