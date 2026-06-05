<?php

namespace App\Filament\Widgets;

use App\Models\Product;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class LatestProducts extends BaseWidget
{
    protected static ?string $heading = '5 sản phẩm mới';
    protected static ?int $sort = 50;

    protected int|string|array $columnSpan = 1;
    protected ?string $pollingInterval = '30s';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Product::query()->latest()
            )
            ->defaultPaginationPageOption(5)
            ->paginated([5, 10])
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Tên Laptop')
                    ->searchable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Ngày đăng')
                    ->dateTime('d/m/Y'),
            ]);
    }
}
