<?php

namespace App\Filament\Widgets;

use App\Models\Category;

use Filament\Widgets\ChartWidget;

class ProductByCategoryChart extends ChartWidget
{
    protected static ?int $sort = 40;
    protected int|string|array $columnSpan = 1;

    protected ?string $heading = 'Cơ cấu Laptop theo Danh mục';
    protected ?string $pollingInterval = '30s';

    protected function getData(): array
    {
        $categories = Category::withCount('products')->get();
        return [
            'datasets' => [
                [
                    'label' => 'Sản phẩm',
                    'data' => $categories->pluck('products_count')->toArray(),
                    'backgroundColor' => '#FBBF24', // Màu vàng FlashTech
                    'borderColor' => '#F59E0B',
                ],
            ],
            'labels' => $categories->pluck('name')->toArray(),
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }

    protected function getOptions(): array
    {
        return [
            'scales' => [
                'y' => [
                    'beginAtZero' => true,
                    'ticks' => [
                        'stepSize' => 1,
                    ],
                ],
            ],
        ];
    }
}
