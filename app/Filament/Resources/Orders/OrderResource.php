<?php

namespace App\Filament\Resources\Orders;

use App\Filament\Resources\Orders\Pages;
use App\Models\Order;
use App\Models\ProductVariant;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Repeater;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Text;
use Filament\Schemas\Components\Image;
use Filament\Schemas\Components\Flex;
use Filament\Schemas\Components\Group;

class OrderResource extends Resource
{
    protected static ?string $model = Order::class;

    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-shopping-bag';

    protected static \UnitEnum|string|null $navigationGroup = 'Kinh doanh';

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Grid::make(3)
                ->schema([
                    // CỘT TRÁI: Thông tin đơn hàng
                    Grid::make(1)
                        ->schema([
                            Section::make('Mặt hàng trong đơn')
                                ->schema([
                                    Repeater::make('items')
                                        ->relationship('items')
                                        ->schema([
                                            Select::make('product_id')
                                                ->relationship('product', 'name')
                                                ->label('Sản phẩm')
                                                ->disabled()
                                                ->columnSpan(3),
                                            TextInput::make('quantity')
                                                ->label('Số lượng')
                                                ->disabled()
                                                ->prefix('x')
                                                ->columnSpan(1),
                                            TextInput::make('unit_price')
                                                ->label('Đơn giá')
                                                ->numeric()
                                                ->disabled()
                                                ->columnSpan(2),
                                        ])
                                        ->columns(6)
                                        ->disableItemCreation()
                                        ->disableItemDeletion()
                                        ->disableLabel(),
                                ]),

                            Section::make('Tóm tắt thanh toán')
                                ->schema([
                                    Forms\Components\Placeholder::make('summary')
                                        ->label('')
                                        ->content(fn ($record) => new \Illuminate\Support\HtmlString("
                                            <div class='space-y-2 text-sm'>
                                                <div class='flex justify-between'>
                                                    <span class='text-gray-500'>Phương thức thanh toán:</span>
                                                    <span class='font-bold text-indigo-600'>{$record->paymentMethod?->name}</span>
                                                </div>
                                                <div class='flex justify-between border-t pt-2 font-bold text-lg'>
                                                    <span>Tổng thanh toán:</span>
                                                    <span>" . number_format($record->total_amount, 0, ',', '.') . " VNĐ</span>
                                                </div>
                                            </div>
                                        ")),
                                ]),
                        ])->columnSpan(2),

                    // CỘT PHẢI: Người duyệt & Khách hàng
                    Grid::make(1)
                        ->schema([
                            Section::make('Người thực hiện duyệt')
                                ->icon('heroicon-o-shield-check')
                                ->schema([
                                    Forms\Components\Placeholder::make('processor_status')
                                        ->label('')
                                        ->content(fn ($record) => new \Illuminate\Support\HtmlString(
                                            $record->processor 
                                            ? "<div class='flex flex-col gap-1'>
                                                <span class='font-bold text-gray-900'>{$record->processor->name}</span>
                                                <span class='text-[10px] px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full w-fit uppercase font-black'>{$record->processor->role}</span>
                                                <p class='text-[10px] text-gray-400 mt-1'>Đã xử lý: {$record->updated_at->format('d/m/Y H:i')}</p>
                                               </div>"
                                            : "<span class='text-amber-600 font-bold italic animate-pulse'>Đang chờ xử lý...</span>"
                                        )),
                                ]),

                            Section::make('Khách hàng')
                                ->schema([
                                    Forms\Components\Placeholder::make('user_info')
                                        ->label('')
                                        ->content(fn ($record) => new \Illuminate\Support\HtmlString("
                                            <div class='text-sm'>
                                                <p className='font-bold'>{$record->user?->name}</p>
                                                <p className='text-gray-500'>{$record->user?->email}</p>
                                                <p className='mt-2 pt-2 border-t text-gray-700'>{$record->shipping_address}</p>
                                            </div>
                                        ")),
                                ]),
                        ])->columnSpan(1),
                ])
        ]);
    }

    public static function infolist(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make()
                    ->schema([
                        Flex::make([
                            Group::make([
                                Text::make(fn ($record) => '#' . ($record->order_code ?? $record->id))
                                    ->weight('bold')
                                    ->size('xl'),
                                Text::make(fn ($record) => $record->created_at?->format('d/m/Y H:i'))
                                    ->color('gray')
                                    ->size('sm'),
                            ])->grow(),
                            Text::make(fn ($record) => match($record->order_status ?? 'pending') {
                                'pending'    => 'Chờ xử lý',
                                'processing' => 'Đang xử lý',
                                'shipped'    => 'Đang giao',
                                'delivered'  => 'Đã giao',
                                'cancelled'  => 'Đã hủy',
                                default      => ucfirst($record->order_status ?? 'pending'),
                            })
                                ->badge()
                                ->color(fn ($record): string => match($record->order_status ?? 'pending') {
                                    'pending'    => 'warning',
                                    'processing' => 'info',
                                    'shipped'    => 'primary',
                                    'delivered'  => 'success',
                                    'cancelled'  => 'danger',
                                    default      => 'gray',
                                }),
                        ])->alignCenter(),
                    ]),

                Section::make('Chi tiết thanh toán & Người duyệt')
                    ->columns(2)
                    ->schema([
                        Group::make([
                            Text::make('Phương thức thanh toán')->color('gray'),
                            Text::make(fn ($record) => $record->paymentMethod?->name ?? 'N/A')->weight('bold'),
                        ]),
                        Group::make([
                            Text::make('Người duyệt đơn')->color('gray'),
                            Text::make(fn ($record) => $record->processor?->name ?? 'Chưa có người duyệt')
                                ->weight('bold')
                                ->color(fn($record) => $record->processed_by_id ? 'success' : 'warning'),
                        ]),
                    ]),

                Section::make('Mặt hàng đã đặt')
                    ->schema(fn ($record) => $record->items->map(fn ($item) =>
                        Flex::make([
                            Image::make(
                                fn () => (str_starts_with($item->product?->thumbnail_url ?? '', 'http'))
                                    ? $item->product->thumbnail_url
                                    : asset('storage/' . ($item->product?->thumbnail_url ?? 'placeholder.png')),
                                'Thumbnail'
                            )->imageSize(50)->grow(false),
                            Text::make($item->product?->name)->weight('bold')->grow(),
                            Text::make(number_format($item->unit_price, 0, ',', '.') . ' ₫ x' . $item->quantity)->grow(false),
                        ])->alignCenter()->extraAttributes(['class' => 'py-2 border-b last:border-0'])
                    )->toArray()),

                Section::make('Tổng cộng')
                    ->schema([
                        Flex::make([
                            Text::make('Tổng tiền thanh toán')->weight('bold')->size('lg'),
                            Text::make(fn ($record) => number_format($record->total_amount, 0, ',', '.') . ' ₫')
                                ->weight('black')
                                ->size('lg')
                                ->color('primary'),
                        ])->alignBetween(),
                    ]),

                // KHÁCH HÀNG + ĐỊA CHỈ
                Grid::make(2)
                    ->schema([
                        Section::make('Khách hàng')
                            ->icon('heroicon-o-user')
                            ->schema([
                                Text::make(fn ($record) => $record->user?->name ?? 'Khách vãng lai')
                                    ->weight('semibold'),
                                Text::make(fn ($record) => $record->user?->email ?? '—')
                                    ->color('gray')
                                    ->size('sm'),
                            ]),

                        Section::make('Địa chỉ nhận hàng')
                            ->icon('heroicon-o-map-pin')
                            ->schema([
                                Text::make(fn ($record) => $record->shipping_address ?? 'Chưa cung cấp')
                                    ->extraAttributes(['class' => 'leading-relaxed text-sm']),
                            ]),
                    ]),

                // GHI CHÚ
                Section::make('Ghi chú')
                    ->icon('heroicon-o-pencil-square')
                    ->collapsed(fn ($record) => empty($record->notes))
                    ->schema([
                        Text::make(fn ($record) => $record->notes ?? 'Không có ghi chú nào.')
                            ->extraAttributes(['class' => 'italic text-gray-500 text-sm']),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('order_code') // (Hoặc order_code)
                    ->label('Mã ĐH')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),

                // Nếu bạn nối với User thì dùng user.name
                Tables\Columns\TextColumn::make('user.name')
                    ->label('Khách hàng')
                    ->searchable(),

                Tables\Columns\TextColumn::make('total_amount') // (Hoặc total_amount)
                    ->label('Tổng tiền')
                    ->money('VND')
                    ->sortable(),

                Tables\Columns\SelectColumn::make('order_status')
                    ->label('Trạng thái')
                    ->options([
                        'pending' => 'Chờ xử lý',
                        'processing' => 'Đang đóng gói',
                        'shipped' => 'Đang vận chuyển',
                        'delivered' => 'Đã giao hàng',
                        'cancelled' => 'Đã hủy',
                    ])
                    ->afterStateUpdated(function ($state, $old, $record) {
                        // TỰ ĐỘNG GÁN NGƯỜI DUYỆT khi trạng thái thay đổi sang processing/shipped/delivered
                        if (in_array($state, ['processing', 'shipped', 'delivered']) && !$record->processed_by_id) {
                            $record->update(['processed_by_id' => auth()->id()]);
                        }

                        // Logic: Chỉ hoàn kho khi trạng thái CHUYỂN THÀNH 'cancelled'
                        if ($state === 'cancelled' && $old !== 'cancelled') {
                            self::restoreStock($record);
                        }
                    }),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Ngày đặt')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
            ])
            ->filters([
                // Thêm bộ lọc nếu muốn
            ])
            ->actions([
                \Filament\Actions\ViewAction::make()
                    ->slideOver()
                    ->modalWidth(\Filament\Support\Enums\Width::FourExtraLarge),
            ])
            ->bulkActions([
                \Filament\Actions\BulkActionGroup::make([
                    \Filament\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc'); // Luôn hiện đơn mới nhất lên đầu
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListOrders::route('/'),
        ];
    }

    /**
     * Hàm tự động hoàn lại số lượng tồn kho cho Biến thể sản phẩm
     */
    protected static function restoreStock(Order $order)
    {
        // Duyệt qua từng món trong đơn hàng
        foreach ($order->items as $item) {
            if ($item->product_variant_id) {
                $variant = ProductVariant::find($item->product_variant_id);
                if ($variant) {
                    // Cột lưu số lượng trong bảng product_variants của bạn (ví dụ: stock hoặc quantity)
                    $variant->increment('stock', $item->quantity);
                }
            }
        }
    }
}
