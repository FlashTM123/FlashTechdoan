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
            // 1. TOP HEADER: ID, Badges and Actions
            Grid::make(2)
                ->schema([
                    Forms\Components\Placeholder::make('id_header')
                        ->label('')
                        ->content(fn ($record) => new \Illuminate\Support\HtmlString("
                            <div class='flex items-center gap-3'>
                                <h1 class='text-2xl font-bold text-gray-900'>Order ID: {$record->order_code}</h1>
                                <span class='px-2 py-0.5 text-xs font-semibold bg-orange-100 text-orange-600 rounded uppercase'>Payment pending</span>
                                <span class='px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-600 rounded uppercase'>Unfulfilled</span>
                            </div>
                            <p class='text-sm text-gray-500 mt-1'>{$record->created_at->format('F j, Y \a\t g:i a')} from Storefront</p>
                        ")),
                    
                    Forms\Components\Placeholder::make('actions_header')
                        ->label('')
                        ->content(new \Illuminate\Support\HtmlString("
                            <div class='flex justify-end gap-2'>
                                <button class='px-4 py-1.5 text-sm font-medium border rounded-lg bg-white hover:bg-gray-50'>Restock</button>
                                <button class='px-4 py-1.5 text-sm font-medium border rounded-lg bg-white hover:bg-gray-50'>Edit</button>
                                <button class='px-4 py-1.5 text-sm font-medium border rounded-lg bg-white hover:bg-gray-50'>More actions ▾</button>
                            </div>
                        ")),
                ])->columnSpanFull(),

            Grid::make(3)
                ->schema([
                    // LEFT COLUMN (Main)
                    Grid::make(1)
                        ->schema([
                            // SECTION: Order Item
                            Section::make('Order Item')
                                ->description('Manage fulfillment for this order')
                                ->schema([
                                    Repeater::make('items')
                                        ->relationship('items')
                                        ->schema([
                                            Forms\Components\ViewField::make('item_preview')
                                                ->view('filament.forms.components.order-item-display') // Cần tạo tệp blade này hoặc dùng placeholder
                                                ->columnSpanFull()
                                                ->hidden(), // Tạm thời ẩn nếu chưa có view

                                            Select::make('product_id')
                                                ->relationship('product', 'name')
                                                ->label('Sản phẩm')
                                                ->disabled()
                                                ->columnSpan(3),
                                            TextInput::make('quantity')
                                                ->label('SL')
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
                                    
                                    Forms\Components\Placeholder::make('fulfill_footer')
                                        ->label('')
                                        ->content(new \Illuminate\Support\HtmlString("
                                            <div class='flex justify-end gap-3 mt-4 pt-4 border-t'>
                                                <button class='px-4 py-2 text-sm font-medium border rounded-lg bg-white hover:bg-gray-50'>Fulfill item</button>
                                                <button class='px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm'>Create shipping label</button>
                                            </div>
                                        ")),
                                ]),

                            // SECTION: Order Summary
                            Section::make('Order Summary')
                                ->schema([
                                    Forms\Components\Placeholder::make('financial_breakdown')
                                        ->label('')
                                        ->content(fn ($record) => new \Illuminate\Support\HtmlString("
                                            <div class='space-y-3 pb-4'>
                                                <div class='flex justify-between text-sm'>
                                                    <span class='text-gray-500'>Subtotal</span>
                                                    <span class='text-gray-900 font-medium'>" . number_format($record->total_amount, 0, ',', '.') . " VNĐ</span>
                                                </div>
                                                <div class='flex justify-between text-sm'>
                                                    <span class='text-gray-500'>Discount</span>
                                                    <span class='text-gray-900'>-0 VNĐ</span>
                                                </div>
                                                <div class='flex justify-between text-sm'>
                                                    <span class='text-gray-500'>Shipping</span>
                                                    <span class='text-gray-900'>0 VNĐ</span>
                                                </div>
                                                <div class='flex justify-between text-base font-bold text-gray-900 border-t pt-3'>
                                                    <span>Total</span>
                                                    <span>" . number_format($record->total_amount, 0, ',', '.') . " VNĐ</span>
                                                </div>
                                            </div>
                                            <div class='space-y-3 pt-4 border-t border-dashed'>
                                                <div class='flex justify-between text-sm'>
                                                    <span class='text-gray-500'>Paid by customer</span>
                                                    <span class='text-gray-900'>0 VNĐ</span>
                                                </div>
                                                <div class='flex justify-between text-sm font-medium'>
                                                    <span class='text-gray-500'>Payment due</span>
                                                    <span class='text-indigo-600 underline cursor-pointer'>Edit</span>
                                                    <span class='text-gray-900'>" . number_format($record->total_amount, 0, ',', '.') . " VNĐ</span>
                                                </div>
                                            </div>
                                            <div class='flex justify-end gap-3 mt-6 pt-4 border-t'>
                                                <button class='px-4 py-2 text-sm font-medium border rounded-lg bg-white hover:bg-gray-50'>Send invoice</button>
                                                <button class='px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm'>Collect payment</button>
                                            </div>
                                        ")),
                                ]),

                            Section::make('Timeline')
                                ->collapsed()
                                ->schema([
                                    Forms\Components\Placeholder::make('timeline_mock')
                                        ->label('')
                                        ->content('Leave a comment...'),
                                ]),
                        ])
                        ->columnSpan(2),

                    // RIGHT COLUMN (Sidebar)
                    Grid::make(1)
                        ->schema([
                            Section::make('Notes')
                                ->schema([
                                    Textarea::make('notes')
                                        ->label('')
                                        ->rows(1)
                                        ->placeholder('No notes provided')
                                        ->disabled(),
                                ]),

                            Section::make('Customers')
                                ->schema([
                                    Forms\Components\Placeholder::make('customer_card')
                                        ->label('')
                                        ->content(fn ($record) => new \Illuminate\Support\HtmlString("
                                            <div class='flex flex-col gap-1'>
                                                <a href='#' class='font-medium text-indigo-600 hover:underline flex items-center gap-2'>
                                                    <svg class='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'></path></svg>
                                                    {$record->customer?->name}
                                                </a>
                                                <p class='text-sm text-gray-500'>1 Order</p>
                                                <p class='text-xs text-gray-400 italic mt-1'>Customer is tax-exempt</p>
                                            </div>
                                        ")),
                                ]),

                            Section::make('Contact Information')
                                ->schema([
                                    Forms\Components\Placeholder::make('contact_card')
                                        ->label('')
                                        ->content(fn ($record) => new \Illuminate\Support\HtmlString("
                                            <div class='flex flex-col gap-1 text-sm'>
                                                <a href='mailto:{$record->customer?->email}' class='text-indigo-600 underline'>{$record->customer?->email}</a>
                                                <span class='text-gray-500 mt-1'>No phone number</span>
                                            </div>
                                        ")),
                                ]),

                            Section::make('Shipping address')
                                ->schema([
                                    Forms\Components\Placeholder::make('shipping_card')
                                        ->label('')
                                        ->content(fn ($record) => new \Illuminate\Support\HtmlString("
                                            <div class='text-sm text-gray-700 leading-relaxed'>
                                                <p class='font-medium text-gray-900'>{$record->customer?->name}</p>
                                                <p>{$record->shipping_address}</p>
                                                <p class='mt-3 text-indigo-600 font-medium cursor-pointer flex items-center gap-1 hover:underline'>
                                                    <svg class='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'></path><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'></path></svg>
                                                    View Map
                                                </p>
                                            </div>
                                        ")),
                                ]),
                        ])
                        ->columnSpan(1),
                ])
        ]);
    }

    public static function infolist(Schema $schema): Schema
    {
        return $schema
            ->components([
                // HEADER: Mã đơn + trạng thái
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
                            Text::make(fn ($record) => match($record->status ?? 'pending') {
                                'pending'    => 'Chờ xử lý',
                                'processing' => 'Đang xử lý',
                                'shipped'    => 'Đang giao',
                                'delivered'  => 'Đã giao',
                                'cancelled'  => 'Đã hủy',
                                default      => ucfirst($record->status ?? 'pending'),
                            })
                                ->badge()
                                ->color(fn ($record): string => match($record->status ?? 'pending') {
                                    'pending'    => 'warning',
                                    'processing' => 'info',
                                    'shipped'    => 'primary',
                                    'delivered'  => 'success',
                                    'cancelled'  => 'danger',
                                    default      => 'gray',
                                })
                                ->grow(false),
                        ])->alignCenter(),
                    ]),

                // MẶT HÀNG ĐÃ ĐẶT
                Section::make('Mặt hàng đã đặt')
                    ->icon('heroicon-o-shopping-bag')
                    ->schema(fn ($record) => $record->items->map(fn ($item) =>
                        Flex::make([
                            Image::make(
                                fn () => (str_starts_with($item->product?->thumbnail_url ?? '', 'http'))
                                    ? $item->product->thumbnail_url
                                    : asset('storage/' . ($item->product?->thumbnail_url ?? 'placeholder.png')),
                                'Product Image'
                            )
                                ->extraAttributes(['class' => 'rounded-lg object-cover'])
                                ->imageSize(56)
                                ->grow(false),
                            Group::make([
                                Text::make($item->product?->name ?? 'Sản phẩm không tồn tại')
                                    ->weight('semibold'),
                                Text::make($item->variant?->sku ?? 'N/A')
                                    ->color('gray')
                                    ->size('sm'),
                            ])->grow()->gap(0),
                            Group::make([
                                Text::make(number_format($item->unit_price, 0, ',', '.') . ' ₫')
                                    ->weight('bold')
                                    ->color('primary'),
                                Text::make('x' . $item->quantity)
                                    ->size('sm')
                                    ->color('gray'),
                            ])->grow(false)->gap(0),
                        ])->alignCenter()->extraAttributes(['class' => 'py-3 border-b last:border-0 gap-4'])
                    )->toArray()),

                // TÓM TẮT TÀI CHÍNH
                Section::make('Tóm tắt tài chính')
                    ->icon('heroicon-o-credit-card')
                    ->schema([
                        Flex::make([
                            Text::make('Tạm tính')->color('gray'),
                            Text::make(fn ($record) => number_format($record->total_amount, 0, ',', '.') . ' ₫'),
                        ])->alignBetween(),

                        Flex::make([
                            Text::make('Phí vận chuyển')->color('gray'),
                            Text::make('Miễn phí')->color('success')->weight('medium'),
                        ])->alignBetween(),

                        Flex::make([
                            Text::make('Tổng cộng')->weight('bold'),
                            Text::make(fn ($record) => number_format($record->total_amount, 0, ',', '.') . ' ₫')
                                ->weight('bold')
                                ->color('primary'),
                        ])->alignBetween()->extraAttributes(['class' => 'border-t pt-3 mt-1']),

                        Flex::make([
                            Text::make('Thanh toán')->color('gray'),
                            Text::make(fn ($record) => match(strtolower($record->payment_status ?? 'pending')) {
                                'paid'    => 'Đã thanh toán',
                                'pending' => 'Chờ thanh toán',
                                'failed'  => 'Thất bại',
                                default   => strtoupper($record->payment_status ?? 'PENDING'),
                            })
                                ->badge()
                                ->color(fn ($record): string => match(strtolower($record->payment_status ?? 'pending')) {
                                    'paid'    => 'success',
                                    'pending' => 'warning',
                                    'failed'  => 'danger',
                                    default   => 'gray',
                                }),
                        ])->alignBetween()->extraAttributes(['class' => 'mt-2']),
                    ]),

                // KHÁCH HÀNG + ĐỊA CHỈ
                Grid::make(2)
                    ->schema([
                        Section::make('Khách hàng')
                            ->icon('heroicon-o-user')
                            ->schema([
                                Text::make(fn ($record) => $record->customer?->name ?? 'Khách vãng lai')
                                    ->weight('semibold'),
                                Text::make(fn ($record) => $record->customer?->email ?? '—')
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

                // Nếu bạn nối với User thì dùng user.name, nếu nối Customer thì dùng customer.name
                Tables\Columns\TextColumn::make('customer.name')
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
                        // Logic: Chỉ hoàn kho khi trạng thái CHUYỂN THÀNH 'cancelled'
                        // và trạng thái cũ KHÁC 'cancelled' (Tránh cộng dồn nhiều lần)
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
