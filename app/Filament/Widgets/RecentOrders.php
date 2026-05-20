<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class RecentOrders extends BaseWidget
{
    protected static ?string $heading = '🕐 Đơn hàng gần đây';
    protected static ?int $sort = 55;

    protected int|string|array $columnSpan = 1;
    protected ?string $pollingInterval = '15s';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Order::query()
                    ->with(['user'])
                    ->latest()
            )
            ->columns([
                Tables\Columns\TextColumn::make('order_code')
                    ->label('Mã ĐH')
                    ->weight('bold')
                    ->searchable(),

                Tables\Columns\TextColumn::make('user.name')
                    ->label('Khách hàng')
                    ->limit(20),

                Tables\Columns\TextColumn::make('total_amount')
                    ->label('Tổng tiền')
                    ->formatStateUsing(fn ($state) => number_format((float)$state, 0, ',', '.') . ' ₫'),

                Tables\Columns\TextColumn::make('order_status')
                    ->label('Trạng thái')
                    ->badge()
                    ->color(fn ($state) => match ($state) {
                        'pending'    => 'warning',
                        'processing' => 'info',
                        'shipped'    => 'primary',
                        'delivered'  => 'success',
                        'cancelled'  => 'danger',
                        default      => 'gray',
                    })
                    ->formatStateUsing(fn ($state) => match ($state) {
                        'pending'    => 'Chờ xử lý',
                        'processing' => 'Đóng gói',
                        'shipped'    => 'Đang giao',
                        'delivered'  => 'Đã giao',
                        'cancelled'  => 'Đã hủy',
                        default      => $state,
                    }),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Thời gian')
                    ->dateTime('d/m H:i')
                    ->sortable(),
            ])
            ->defaultPaginationPageOption(8)
            ->paginated([8, 25]);
    }
}
