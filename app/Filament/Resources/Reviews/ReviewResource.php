<?php

namespace App\Filament\Resources\Reviews;

use App\Filament\Resources\Reviews\Pages\ListReviews;
use App\Models\Review;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;

class ReviewResource extends Resource
{
    protected static ?string $model = Review::class;

    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-chat-bubble-bottom-center-text';
    protected static ?string $navigationLabel = 'Đánh giá';
    protected static \UnitEnum|string|null $navigationGroup = 'Kinh doanh';
    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            // Không sử dụng Form vì không cho phép tạo mới/chỉnh sửa
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                // Hiển thị tên người dùng
                TextColumn::make('user.name')
                    ->label('Người đánh giá')
                    ->searchable()
                    ->sortable(),

                // Hiển thị tên sản phẩm
                TextColumn::make('product.name')
                    ->label('Sản phẩm')
                    ->searchable(),

                // Hiển thị Rating dạng Ngôi sao
                TextColumn::make('rating')
                    ->label('Đánh giá')
                    ->html()
                    ->state(function ($record) {
                        $stars = str_repeat('⭐', $record->rating);
                        $emptyStars = str_repeat('☆', 5 - $record->rating);
                        return "<span style='color: #FBBF24; font-size: 16px;'>{$stars}</span><span style='color: #D1D5DB;'>{$emptyStars}</span>";
                    })
                    ->sortable(),

                // Nội dung bình luận
                TextColumn::make('content')
                    ->label('Nội dung')
                    ->limit(50),

                // Nút Toggle duyệt nhanh
                ToggleColumn::make('is_visible')
                    ->label('Hiển thị')
                    ->sortable(),

                TextColumn::make('created_at')
                    ->label('Ngày gửi')
                    ->dateTime('d/m/Y H:i')
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\Filter::make('is_visible')
                    ->label('Đã duyệt')
                    ->query(fn ($query) => $query->where('is_visible', true)),
            ])
            ->actions([
                // ĐÃ LOẠI BỎ EDIT ACTION
                \Filament\Actions\DeleteAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListReviews::route('/'),
        ];
    }
}
