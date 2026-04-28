<?php

namespace App\Filament\Widgets;

use App\Models\Review;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class PendingReview extends BaseWidget
{
    protected static ?string $heading = 'Đánh giá chưa duyệt';
    protected ?string $pollingInterval = '30s';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Review::query()->where('is_visible', false)->latest()->limit(5)
            )
            ->columns([
                Tables\Columns\TextColumn::make('customer.name')
                    ->label('Khách hàng'),
                Tables\Columns\TextColumn::make('rating')
                    ->label('Số sao')
                    ->state(fn ($record) => str_repeat('⭐', $record->rating)),
                Tables\Columns\TextColumn::make('content')
                    ->label('Nội dung')
                    ->limit(20),
            ]);
    }
}
