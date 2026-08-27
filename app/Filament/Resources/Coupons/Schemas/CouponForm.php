<?php

namespace App\Filament\Resources\Coupons\Schemas;

use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Grid;

class CouponForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('🏷️ Thông Tin Mã Giảm Giá')
                ->description('Thiết lập các mã coupon giảm giá và quy tắc sử dụng cho khách hàng')
                ->icon('heroicon-o-tag')
                ->schema([
                    Grid::make(2)->schema([
                        Forms\Components\TextInput::make('code')
                            ->label('Mã giảm giá')
                            ->placeholder('VD: SALE10, FLASHTECH20')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->live(debounce: 300)
                            ->afterStateUpdated(fn ($set, $state) => $set('code', strtoupper((string) $state)))
                            ->helperText('Mã sẽ tự động chuyển thành chữ in hoa.')
                            ->extraAttributes(['style' => 'font-family: monospace; font-weight: bold;']),

                        Forms\Components\Select::make('type')
                            ->label('Loại giảm giá')
                            ->options([
                                'fixed'   => '₫  Số tiền cố định',
                                'percent' => '%  Phần trăm',
                            ])
                            ->required()
                            ->live()
                            ->default('fixed'),
                    ]),

                    Grid::make(2)->schema([
                        Forms\Components\TextInput::make('value')
                            ->label(fn ($get) => $get('type') === 'percent' ? 'Giá trị giảm (%)' : 'Số tiền giảm (₫)')
                            ->numeric()
                            ->required()
                            ->minValue(0)
                            ->maxValue(fn ($get) => $get('type') === 'percent' ? 100 : null)
                            ->suffix(fn ($get) => $get('type') === 'percent' ? '%' : '₫'),

                        Forms\Components\TextInput::make('min_order_amount')
                            ->label('Đơn hàng tối thiểu (₫)')
                            ->numeric()
                            ->default(0)
                            ->suffix('₫')
                            ->helperText('Để 0 nếu không yêu cầu đơn tối thiểu.'),
                    ]),

                    Grid::make(2)->schema([
                        Forms\Components\TextInput::make('usage_limit')
                            ->label('Giới hạn lượt dùng')
                            ->numeric()
                            ->nullable()
                            ->placeholder('Để trống = không giới hạn'),

                        Forms\Components\DateTimePicker::make('expires_at')
                            ->label('Ngày hết hạn')
                            ->nullable()
                            ->minDate(now())
                            ->placeholder('Để trống = vĩnh viễn'),
                    ]),

                    Forms\Components\Toggle::make('is_active')
                        ->label('Kích hoạt mã giảm giá này')
                        ->default(true),
                ])
                ->columnSpanFull(),
        ]);
    }
}
