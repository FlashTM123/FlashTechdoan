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
                // Hiển thị tên sản phẩm
                TextColumn::make('product.name')
                    ->label('Sản phẩm')
                    ->searchable(),

                // Tên người đánh giá
                TextColumn::make('user.name')
                    ->label('Người đánh giá')
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

                // Trạng thái duyệt
                TextColumn::make('status')
                    ->label('Trạng thái')
                    ->badge()
                    ->color(fn ($state) => match ($state) {
                        'approved' => 'success',
                        'rejected' => 'danger',
                        default    => 'warning',
                    })
                    ->formatStateUsing(fn ($state) => match ($state) {
                        'approved' => 'Đã duyệt',
                        'rejected' => 'Từ chối',
                        default    => 'Chờ duyệt',
                    }),

                // Nút Toggle hiển thị
                ToggleColumn::make('is_visible')
                    ->label('Hiển thị')
                    ->sortable(),

                TextColumn::make('created_at')
                    ->label('Ngày gửi')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
            ])
            ->filters([
                // UI 4: Filter mặc định hiện review chờ duyệt
                Tables\Filters\SelectFilter::make('status')
                    ->label('Trạng thái')
                    ->options([
                        'pending'  => '🟡 Chờ duyệt',
                        'approved' => '🟢 Đã duyệt',
                        'rejected' => '🔴 Từ chối',
                    ])
                    ->placeholder('Tất cả'),

                Tables\Filters\Filter::make('is_visible')
                    ->label('Đang hiển thị')
                    ->query(fn ($query) => $query->where('is_visible', true)),
            ])
            ->actions([
                // Filament v5: dùng ButtonAction cho custom actions
                \Filament\Actions\ButtonAction::make('approve')
                    ->label('Duyệt')
                    ->icon('heroicon-m-check-badge')
                    ->color('success')
                    ->visible(fn ($record) => $record->status === 'pending')
                    ->requiresConfirmation()
                    ->action(fn ($record) => $record->update([
                        'status'     => 'approved',
                        'is_visible' => true,
                    ])),

                \Filament\Actions\ButtonAction::make('reject')
                    ->label('Từ chối')
                    ->icon('heroicon-m-x-circle')
                    ->color('danger')
                    ->visible(fn ($record) => $record->status === 'pending')
                    ->requiresConfirmation()
                    ->action(fn ($record) => $record->update([
                        'status'     => 'rejected',
                        'is_visible' => false,
                    ])),

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
