<?php

namespace App\Filament\Widgets;

use App\Models\ProductVariant;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;
use Illuminate\Database\Eloquent\Builder;

class LowStockProducts extends BaseWidget
{
    protected static ?string $heading = '⚠️ Cảnh báo hết hàng / Tồn kho thấp';
    protected static ?int $sort = 42;

    protected int|string|array $columnSpan = 1;
    protected ?string $pollingInterval = '60s';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                ProductVariant::query()
                    ->with(['product'])
                    ->where('stock', '<', 10)
                    ->orderBy('stock')
            )
            ->columns([
                Tables\Columns\TextColumn::make('product.name')
                    ->label('Sản phẩm')
                    ->wrap()
                    ->limit(25)
                    ->sortable(),

                Tables\Columns\TextColumn::make('variant_name')
                    ->label('Biến thể')
                    ->limit(20)
                    ->sortable(),

                Tables\Columns\TextColumn::make('stock')
                    ->label('Tồn kho')
                    ->badge()
                    ->color(fn ($state) => $state == 0 ? 'danger' : ($state < 5 ? 'warning' : 'warning'))
                    ->suffix(' cái')
                    ->sortable(),

                Tables\Columns\TextColumn::make('sku')
                    ->label('SKU')
                    ->limit(15)
                    ->copyable(),
            ])
            ->defaultPaginationPageOption(8)
            ->paginated([8, 25]);
    }
}
