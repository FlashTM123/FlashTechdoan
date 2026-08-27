<?php

namespace App\Filament\Widgets;

use App\Models\Review;
use Filament\Actions\ButtonAction;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class PendingReview extends BaseWidget
{
    protected static ?string $heading = 'Đánh giá chờ duyệt';
    protected static ?int $sort = 60;
    protected static bool $isDiscovered = false; // Ẩn khỏi dashboard

    protected int|string|array $columnSpan = 1;
    protected ?string $pollingInterval = '30s';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                // BUG 2 FIX: dùng status = 'pending' thay vì is_visible = false
                Review::query()
                    ->where('status', 'pending')
                    ->with(['product', 'user'])
                    ->latest()
            )
            ->columns([
                Tables\Columns\TextColumn::make('product.name')
                    ->label('Sản phẩm')
                    ->wrap()
                    ->limit(25),

                Tables\Columns\TextColumn::make('user.name')
                    ->label('Người đánh giá')
                    ->limit(20),

                Tables\Columns\TextColumn::make('rating')
                    ->label('Số sao')
                    ->state(fn ($record) => str_repeat('⭐', (int) $record->rating)),

                Tables\Columns\TextColumn::make('content')
                    ->label('Nội dung')
                    ->limit(30),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Ngày gửi')
                    ->dateTime('d/m/Y H:i')
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->actions([
                // Filament v5: dùng ButtonAction cho custom actions trong table widget
                ButtonAction::make('approve')
                    ->label('Duyệt')
                    ->icon('heroicon-m-check-badge')
                    ->color('success')
                    ->requiresConfirmation()
                    ->modalHeading('Duyệt đánh giá?')
                    ->modalDescription('Đánh giá sẽ được hiển thị công khai sau khi duyệt.')
                    ->action(function ($record) {
                        $record->update([
                            'status'     => 'approved',
                            'is_visible' => true,
                        ]);
                    }),

                ButtonAction::make('reject')
                    ->label('Từ chối')
                    ->icon('heroicon-m-x-circle')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->action(function ($record) {
                        $record->update([
                            'status'     => 'rejected',
                            'is_visible' => false,
                        ]);
                    }),
            ])
            ->defaultPaginationPageOption(5)
            ->paginated([5, 10]);
    }
}
