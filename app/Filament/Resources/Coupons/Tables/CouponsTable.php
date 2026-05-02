<?php

namespace App\Filament\Resources\Coupons\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class CouponsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('code')
                    ->label('Mã giảm giá')
                    ->weight('bold')
                    ->copyable()
                    ->copyMessage('Đã copy mã!')
                    ->searchable()
                    ->sortable()
                    ->fontFamily('mono'),

                TextColumn::make('type')
                    ->label('Loại')
                    ->badge()
                    ->formatStateUsing(fn ($state) => $state === 'percent' ? '% Phần trăm' : '₫ Cố định')
                    ->color(fn ($state) => $state === 'percent' ? 'info' : 'success'),

                TextColumn::make('value')
                    ->label('Giá trị')
                    ->formatStateUsing(fn ($state, $record) =>
                        $record->type === 'percent'
                            ? number_format($state, 0) . '%'
                            : number_format($state, 0, ',', '.') . ' ₫'
                    )
                    ->weight('semibold')
                    ->color('primary'),

                TextColumn::make('min_order_amount')
                    ->label('Đơn tối thiểu')
                    ->formatStateUsing(fn ($state) =>
                        $state > 0
                            ? number_format($state, 0, ',', '.') . ' ₫'
                            : 'Không giới hạn'
                    )
                    ->color(fn ($state) => $state > 0 ? 'gray' : 'success'),

                TextColumn::make('used_count')
                    ->label('Đã dùng')
                    ->formatStateUsing(fn ($state, $record) =>
                        $record->usage_limit !== null
                            ? "{$state} / {$record->usage_limit}"
                            : "{$state} / ∞"
                    )
                    ->color(fn ($record) =>
                        $record->usage_limit && $record->used_count >= $record->usage_limit
                            ? 'danger'
                            : 'gray'
                    ),

                TextColumn::make('expires_at')
                    ->label('Hết hạn')
                    ->dateTime('d/m/Y H:i')
                    ->color(fn ($record) =>
                        $record->expires_at && $record->expires_at->isPast()
                            ? 'danger'
                            : 'gray'
                    )
                    ->placeholder('Vô thời hạn')
                    ->sortable(),

                ToggleColumn::make('is_active')
                    ->label('Kích hoạt'),
            ])
            ->filters([
                TernaryFilter::make('is_active')
                    ->label('Trạng thái')
                    ->trueLabel('Đang hoạt động')
                    ->falseLabel('Đã tắt'),

                SelectFilter::make('type')
                    ->label('Loại')
                    ->options([
                        'fixed'   => 'Cố định (₫)',
                        'percent' => 'Phần trăm (%)',
                    ]),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc')
            ->emptyStateHeading('Chưa có mã giảm giá nào')
            ->emptyStateDescription('Tạo mã giảm giá đầu tiên để thu hút khách hàng!')
            ->emptyStateIcon('heroicon-o-tag');
    }
}
