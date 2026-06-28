<?php

namespace App\Filament\Widgets;

use App\Models\Product;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Tables\Filters\Filter;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Widgets\TableWidget as BaseWidget;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class TopSellingByPeriod extends BaseWidget
{
    protected static ?string $heading = '📊 Top 5 bán chạy theo thời gian';
    protected static ?int $sort = 46;
    protected int|string|array $columnSpan = 1;
    protected ?string $pollingInterval = '60s';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Product::query()
                    ->select([
                        'products.id',
                        'products.name',
                        DB::raw('COALESCE(SUM(oi.quantity), 0) as total_sold'),
                        DB::raw('COALESCE(SUM(oi.quantity * oi.unit_price), 0) as total_revenue'),
                    ])
                    ->leftJoin('order_items as oi', 'products.id', '=', 'oi.product_id')
                    ->leftJoin('orders as o', function ($join) {
                        $join->on('oi.order_id', '=', 'o.id')
                            ->where('o.order_status', '=', 'delivered');
                    })
                    ->groupBy('products.id', 'products.name')
                    ->orderByDesc('total_sold')
                    ->limit(5)
            )
            ->filters([
                Filter::make('period_filter')
                    ->label('Thời gian')
                    ->form([
                        Select::make('period')
                            ->label('Khoảng thời gian')
                            ->options([
                                'today'  => 'Hôm nay',
                                'week'   => 'Tuần này',
                                'month'  => 'Tháng này',
                                'year'   => 'Năm nay',
                                'custom' => 'Tùy chọn ngày...',
                            ])
                            ->default('month')
                            ->live(),

                        DatePicker::make('from')
                            ->label('Từ ngày')
                            ->maxDate(now()->toDateString())
                            ->native(false)
                            ->displayFormat('d/m/Y')
                            ->visible(fn ($get) => $get('period') === 'custom'),

                        DatePicker::make('to')
                            ->label('Đến ngày')
                            ->default(now()->toDateString())
                            ->maxDate(now()->toDateString())
                            ->native(false)
                            ->displayFormat('d/m/Y')
                            ->visible(fn ($get) => $get('period') === 'custom'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        $period = $data['period'] ?? 'month';

                        if ($period === 'custom') {
                            if (filled($data['from'] ?? null)) {
                                $query->where('o.created_at', '>=', Carbon::parse($data['from'])->startOfDay());
                            }
                            if (filled($data['to'] ?? null)) {
                                $query->where('o.created_at', '<=', Carbon::parse($data['to'])->endOfDay());
                            }
                        } else {
                            $range = match ($period) {
                                'today' => [Carbon::today()->startOfDay(), Carbon::today()->endOfDay()],
                                'week'  => [Carbon::now()->startOfWeek(Carbon::MONDAY), Carbon::now()->endOfWeek()],
                                'year'  => [Carbon::now()->startOfYear(), Carbon::now()->endOfYear()],
                                default => [Carbon::now()->startOfMonth(), Carbon::now()->endOfMonth()],
                            };
                            $query->whereBetween('o.created_at', $range);
                        }

                        return $query;
                    })
                    ->indicateUsing(function (array $data): ?string {
                        $period = $data['period'] ?? 'month';
                        if ($period === 'custom') {
                            $from = filled($data['from'] ?? null) ? Carbon::parse($data['from'])->format('d/m/Y') : '?';
                            $to   = filled($data['to']   ?? null) ? Carbon::parse($data['to'])->format('d/m/Y')   : '?';
                            return "Từ {$from} → {$to}";
                        }
                        return match ($period) {
                            'today' => 'Hôm nay',
                            'week'  => 'Tuần này',
                            'year'  => 'Năm nay',
                            default => 'Tháng này',
                        };
                    }),
            ])
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Sản phẩm')
                    ->wrap()
                    ->formatStateUsing(function ($state, $record, $rowLoop) {
                        $medals = ['🥇', '🥈', '🥉'];
                        $prefix = $medals[$rowLoop->index] ?? "#{$rowLoop->iteration}";
                        return "{$prefix} {$state}";
                    }),

                Tables\Columns\TextColumn::make('total_sold')
                    ->label('Đã bán')
                    ->badge()
                    ->color('success')
                    ->suffix(' cái')
                    ->alignCenter()
                    ->sortable(),

                Tables\Columns\TextColumn::make('total_revenue')
                    ->label('Doanh thu')
                    ->formatStateUsing(fn ($state) => number_format((float) $state, 0, ',', '.') . ' ₫')
                    ->alignRight()
                    ->sortable(),
            ])
            ->paginated(false);
    }
}
