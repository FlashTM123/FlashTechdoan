<?php

namespace App\Filament\Widgets;

use App\Models\Product;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Builder;

class TopSellingProducts extends BaseWidget
{
    protected static ?string $heading = '🏆 Top 5 sản phẩm bán chạy';
    protected static ?int $sort = 45;

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
            )
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Sản phẩm')
                    ->wrap(),

                Tables\Columns\TextColumn::make('total_sold')
                    ->label('Đã bán')
                    ->badge()
                    ->color('success')
                    ->suffix(' cái')
                    ->sortable(),

                Tables\Columns\TextColumn::make('total_revenue')
                    ->label('Doanh thu')
                    ->formatStateUsing(fn ($state) => number_format((float)$state, 0, ',', '.') . ' ₫')
                    ->sortable(),
            ])
            ->defaultPaginationPageOption(5)
            ->paginated([5]);
    }
}
