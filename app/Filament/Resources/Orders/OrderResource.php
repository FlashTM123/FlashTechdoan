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
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Components\Utilities\Set;

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
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;

class OrderResource extends Resource
{
    protected static ?string $model = Order::class;

    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-shopping-bag';

    protected static \UnitEnum|string|null $navigationGroup = 'Kinh doanh';

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            // ------------------------------------------------------------------
            // KHỐI 1: Giao diện tạo đơn hàng Offline (Chỉ hiển thị khi bấm Tạo mới)
            // ------------------------------------------------------------------
            Tabs::make('Create Order')
                ->visible(fn (string $operation) => $operation === 'create')
                ->tabs([
                    Tab::make('Tạo đơn hàng bán tại quầy')
                        ->icon('heroicon-o-shopping-bag')
                        ->schema([
                            Grid::make(3)->schema([
                                Select::make('user_id')
                                    ->relationship(
                                        name: 'user',
                                        titleAttribute: 'name',
                                        modifyQueryUsing: fn (\Illuminate\Database\Eloquent\Builder $query) => $query->where('role', 'customer'),
                                    )
                                    ->label('Khách hàng')
                                    ->required()
                                    ->searchable()
                                    ->preload()
                                    ->placeholder('Tìm kiếm hoặc chọn từ danh sách...')
                                    ->createOptionForm([
                                        Forms\Components\TextInput::make('name')
                                            ->label('Tên khách hàng')
                                            ->required(),
                                        Forms\Components\TextInput::make('email')
                                            ->label('Email')
                                            ->email()
                                            ->required()
                                            ->unique('users', 'email'),
                                        Forms\Components\TextInput::make('phone')
                                            ->label('Số điện thoại')
                                            ->tel()
                                            ->nullable(),
                                    ])
                                    ->createOptionUsing(function (array $data): int {
                                        $data['password'] = bcrypt(\Illuminate\Support\Str::random(12));
                                        $data['role'] = 'customer';
                                        $user = \App\Models\User::create($data);
                                        return $user->id;
                                    })
                                    ->columnSpan(2),

                                TextInput::make('order_code')
                                    ->label('Mã đơn hàng (Tự động)')
                                    ->default(fn () => 'ORD-OFF-' . strtoupper(uniqid()))
                                    ->required()
                                    ->disabled()
                                    ->dehydrated()
                                    ->columnSpan(1),
                            ]),

                            Grid::make(3)->schema([
                                Select::make('payment_method_id')
                                    ->relationship('paymentMethod', 'name')
                                    ->label('Phương thức thanh toán')
                                    ->required()
                                    ->default(1)
                                    ->columnSpan(1),

                                Select::make('payment_status')
                                    ->label('Trạng thái thanh toán')
                                    ->options([
                                        'pending' => 'Chờ thanh toán',
                                        'paid' => 'Đã thanh toán',
                                        'failed' => 'Thất bại',
                                    ])
                                    ->default('paid')
                                    ->required()
                                    ->columnSpan(1),

                                Select::make('order_status')
                                    ->label('Trạng thái đơn hàng')
                                    ->options([
                                        'pending' => 'Chờ xử lý',
                                        'processing' => 'Đang đóng gói',
                                        'shipped' => 'Đang giao hàng',
                                        'delivered' => 'Đã giao hàng',
                                        'cancelled' => 'Đã hủy',
                                    ])
                                    ->default('delivered')
                                    ->required()
                                    ->columnSpan(1),
                            ]),

                            TextInput::make('shipping_address')
                                ->label('Địa chỉ giao hàng')
                                ->default('Mua trực tiếp tại cửa hàng (Offline)')
                                ->required(),

                            Textarea::make('notes')
                                ->label('Ghi chú của khách hàng')
                                ->rows(2)
                                ->nullable(),

                            Forms\Components\Placeholder::make('divider_1')
                                ->hiddenLabel()
                                ->content(new \Illuminate\Support\HtmlString('<hr style="border: 0; border-top: 1px solid rgba(226, 232, 240, 0.6); margin: 24px 0;" />')),

                            Forms\Components\Placeholder::make('items_heading')
                                ->hiddenLabel()
                                ->content(new \Illuminate\Support\HtmlString('
                                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                                        <span style="padding: 6px; border-radius: 8px; background-color: rgba(99, 102, 241, 0.1); color: rgb(99, 102, 241); display: inline-flex; align-items: center; justify-content: center;">
                                            <svg style="width: 20px; height: 20px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                        </span>
                                        <h3 style="font-size: 18px; font-weight: bold; margin: 0; color: inherit;">Danh sách sản phẩm chọn mua</h3>
                                    </div>
                                ')),

                            Repeater::make('items')
                                ->relationship('items')
                                ->label('')
                                ->schema([
                                    Select::make('product_variants_id')
                                        ->label('Sản phẩm & Cấu hình')
                                        ->options(function () {
                                            return \App\Models\ProductVariant::with('product')
                                                ->get()
                                                ->mapWithKeys(function ($variant) {
                                                    $name = ($variant->product?->name ?? 'Sản phẩm') . ' - ' . ($variant->variant_name ?? 'Cấu hình');
                                                    $price = number_format($variant->price, 0, ',', '.') . ' ₫';
                                                    $stock = $variant->stock > 0 ? " (Kho: {$variant->stock})" : ' (Hết hàng)';
                                                    return [$variant->id => "{$name} | Giá: {$price}{$stock}"];
                                                });
                                        })
                                        ->required()
                                        ->searchable()
                                        ->reactive()
                                        ->afterStateUpdated(function ($state, Set $set) {
                                            if ($state) {
                                                $variant = \App\Models\ProductVariant::find($state);
                                                if ($variant) {
                                                    $set('unit_price', (float) $variant->price);
                                                    $set('product_id', $variant->product_id);

                                                    // ⚠️ Cảnh báo nếu chọn sản phẩm hết hàng
                                                    if ($variant->stock <= 0) {
                                                        \Filament\Notifications\Notification::make()
                                                            ->title('⚠️ Sản phẩm đang hết hàng!')
                                                            ->body("Biến thể này hiện có stock = 0. Vui lòng chọn sản phẩm khác hoặc xác nhận trước khi tạo đơn.")
                                                            ->warning()
                                                            ->persistent()
                                                            ->send();
                                                    }
                                                }
                                            }
                                        })
                                        ->columnSpan(['default' => 12, 'md' => 7]),

                                    Forms\Components\Hidden::make('product_id'),

                                    TextInput::make('quantity')
                                        ->label('Số lượng')
                                        ->numeric()
                                        ->default(1)
                                        ->minValue(1)
                                        ->required()
                                        ->reactive()
                                        ->afterStateUpdated(function ($state, Get $get) {
                                            $variantId = $get('product_variants_id');
                                            if ($variantId && $state !== null) {
                                                $variant = \App\Models\ProductVariant::find($variantId);
                                                if ($variant && $variant->stock <= 0) {
                                                    \Filament\Notifications\Notification::make()
                                                        ->title('🚫 Sản phẩm đã hết hàng!')
                                                        ->body('Sản phẩm này hiện có tồn kho = 0, không thể tạo đơn. Vui lòng chọn sản phẩm khác.')
                                                        ->danger()
                                                        ->persistent()
                                                        ->send();
                                                } elseif ($variant && (int) $state > $variant->stock) {
                                                    \Filament\Notifications\Notification::make()
                                                        ->title('⚠️ Vượt quá tồn kho!')
                                                        ->body("Kho hiện chỉ còn {$variant->stock} máy. Vui lòng giảm số lượng.")
                                                        ->warning()
                                                        ->persistent()
                                                        ->send();
                                                }
                                            }
                                        })
                                        ->rules([
                                            fn (Get $get) => function (string $attribute, $value, $fail) use ($get) {
                                                $variantId = $get('product_variants_id');
                                                if ($variantId) {
                                                    $variant = \App\Models\ProductVariant::find($variantId);
                                                    if ($variant && $variant->stock <= 0) {
                                                        $fail('Sản phẩm này đã hết hàng, không thể tạo đơn.');
                                                    } elseif ($variant && (int) $value > $variant->stock) {
                                                        $fail("Chỉ còn {$variant->stock} máy trong kho.");
                                                    }
                                                }
                                            },
                                        ])
                                        ->columnSpan(['default' => 12, 'md' => 2]),

                                    TextInput::make('unit_price')
                                        ->label('Đơn giá')
                                        ->prefix('₫')
                                        ->required()
                                        ->live(onBlur: true)
                                        ->formatStateUsing(function ($state) {
                                            // Strip dấu chấm (nếu đã format) rồi format lại
                                            $raw = (float) str_replace(['.', ',', ' '], ['', '.', ''], (string) $state);
                                            return $raw > 0 ? number_format($raw, 0, ',', '.') : '';
                                        })
                                        ->dehydrateStateUsing(fn ($state) => (float) str_replace(['.', ',', ' '], ['', '.', ''], (string) $state))
                                        ->columnSpan(['default' => 12, 'md' => 3]),
                                ])
                                ->columns(12)
                                ->required()
                                ->reactive()
                                ->afterStateUpdated(function (Get $get, Set $set) {
                                    $items = $get('items') ?? [];
                                    $total = 0;
                                    foreach ($items as $item) {
                                        $quantity = intval($item['quantity'] ?? 0);
                                        // Strip đấu chấm phân cách trước khi tính
                                        $rawPrice = str_replace(['.', ' '], '', (string) ($item['unit_price'] ?? 0));
                                        $price = (float) $rawPrice;
                                        $total += $quantity * $price;
                                    }
                                    $set('total_amount', $total);
                                })
                                ->itemLabel(fn (array $state): ?string =>
                                    isset($state['product_variants_id'])
                                        ? \App\Models\ProductVariant::find($state['product_variants_id'])?->variant_name
                                        : null
                                ),

                            Forms\Components\Placeholder::make('divider_2')
                                ->hiddenLabel()
                                ->content(new \Illuminate\Support\HtmlString('<hr style="border: 0; border-top: 1px solid rgba(226, 232, 240, 0.6); margin: 24px 0;" />')),

                            Forms\Components\Placeholder::make('invoice_heading')
                                ->hiddenLabel()
                                ->content(new \Illuminate\Support\HtmlString('
                                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                                        <span style="padding: 6px; border-radius: 8px; background-color: rgba(99, 102, 241, 0.1); color: rgb(99, 102, 241); display: inline-flex; align-items: center; justify-content: center;">
                                            <svg style="width: 20px; height: 20px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                        </span>
                                        <h3 style="font-size: 18px; font-weight: bold; margin: 0; color: inherit;">Hóa đơn thanh toán</h3>
                                    </div>
                                ')),

                            Forms\Components\Placeholder::make('total_display')
                                ->hiddenLabel()
                                ->content(function (Get $get) {
                                    $items = $get('items') ?? [];
                                    $total = 0;
                                    $totalQty = 0;
                                    foreach ($items as $item) {
                                        $qty = intval($item['quantity'] ?? 0);
                                        // Strip đấu chấm phân cách trước khi tính
                                        $rawPrice = str_replace(['.', ' '], '', (string) ($item['unit_price'] ?? 0));
                                        $price = (float) $rawPrice;
                                        $total += $qty * $price;
                                        $totalQty += $qty;
                                    }

                                    return new \Illuminate\Support\HtmlString("
                                        <div class='rounded-xl border border-indigo-100/50 dark:border-indigo-900/30 p-5 bg-indigo-50/30 dark:bg-indigo-950/10 max-w-xl mx-auto space-y-4'>
                                            <div class='flex justify-between items-center text-sm text-slate-500 dark:text-slate-400'>
                                                <span>Tổng số lượng sản phẩm:</span>
                                                <span class='font-bold text-slate-800 dark:text-slate-200'>{$totalQty} sản phẩm</span>
                                            </div>
                                            <div class='border-t border-dashed border-indigo-100 dark:border-indigo-900/40 my-2'></div>
                                            <div class='flex justify-between items-center'>
                                                <div class='flex flex-col gap-1'>
                                                    <span class='text-xs text-slate-400 uppercase font-black tracking-wider'>Tổng tiền phải thanh toán</span>
                                                    <span class='text-4xl font-black text-indigo-600 dark:text-indigo-400 font-mono'>" . number_format($total, 0, ',', '.') . " ₫</span>
                                                </div>
                                                <div class='text-xs text-slate-400 italic text-right max-w-[200px]'>
                                                    Vui lòng kiểm tra kỹ số lượng trước khi nhấn nút Lưu.
                                                </div>
                                            </div>
                                        </div>
                                    ");
                                }),

                            Forms\Components\Hidden::make('total_amount')
                                ->default(0)
                                ->required()
                                ->dehydrated(),
                        ])
                ])
                ->columnSpanFull(),

            // ------------------------------------------------------------------
            // KHỐI 2: Giao diện Xem / Duyệt đơn hàng
            // ------------------------------------------------------------------
            Grid::make(3)
                ->visible(fn (string $operation) => $operation !== 'create')
                ->schema([
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
                                        ->hiddenLabel()
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
                                        ->hiddenLabel()
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
                                        ->hiddenLabel()
                                        ->content(fn ($record) => new \Illuminate\Support\HtmlString("
                                            <div class='text-sm'>
                                                <p class='font-bold'>{$record->user?->name}</p>
                                                <p class='text-gray-500'>{$record->user?->email}</p>
                                                <p class='mt-2 pt-2 border-t text-gray-700'>{$record->shipping_address}</p>
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
                                'processing' => 'Đang đóng gói',
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
                    ->options(fn ($record) => self::getAllowedTransitions($record->order_status ?? 'pending'))
                    ->placeholder(null)
                    ->disabled(fn ($record) => in_array($record->order_status, ['cancelled', 'delivered']))
                    ->afterStateUpdated(function ($state, $old, $record) {
                        // ── BỎ QUA NẾU STATE RỖng/NULL ───────────────────────────────────
                        if (empty($state)) {
                            return;
                        }

                        // ── VALIDATE BẰNG GIÁ TRỊ DB THỰC (không dùng $old từ Livewire vì bị stale) ──
                        // Lấy lại trạng thái THỰC TẾ từ DB trước khi Filament ghi $state
                        // (Filament đã save rồi nên $record->order_status = $state, phải query riêng)
                        $freshPrevious = \App\Models\Order::where('id', $record->id)
                            ->value('order_status') ?? 'pending';
                        // Lúc này freshPrevious = $state (Filament đã save), nên dùng $state
                        // làm điểm cuối để suy ngược lại previous không được.
                        // → Thay vào đó: chỉ validate $state là một giá trị hợp lệ trong hệ thống.
                        $validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
                        if (!in_array($state, $validStatuses)) {
                            $record->update(['order_status' => $old ?? 'pending']);
                            \Filament\Notifications\Notification::make()
                                ->title('❌ Trạng thái không hợp lệ')
                                ->body("Giá trị \"$state\" không phải trạng thái hợp lệ.")
                                ->danger()
                                ->send();
                            return;
                        }

                        // TỰ ĐỘNG GÁN NGƯỜI DUYỆT khi trạng thái thay đổi sang processing/shipped/delivered
                        if (in_array($state, ['processing', 'shipped', 'delivered']) && !$record->processed_by_id) {
                            $record->update(['processed_by_id' => auth()->id()]);
                        }

                        // Logic: Chỉ hoàn kho khi trạng thái CHUYỂN THÀNH 'cancelled'
                        if ($state === 'cancelled') {
                            self::restoreStock($record);
                        }

                        // PHÁT SỰ KIỆN: Thông báo cho khách hàng khi Admin đổi trạng thái
                        event(new \App\Events\OrderStatusUpdated($record));
                    }),


                Tables\Columns\TextColumn::make('created_at')
                    ->label('Ngày đặt')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
            ])
            ->filters([
                // UI 5: Filter theo trạng thái đơn hàng
                Tables\Filters\SelectFilter::make('order_status')
                    ->label('Trạng thái')
                    ->options([
                        'pending'    => '🟡 Chờ xử lý',
                        'processing' => '🔵 Đang đóng gói',
                        'shipped'    => '🟣 Đang vận chuyển',
                        'delivered'  => '🟢 Đã giao hàng',
                        'cancelled'  => '🔴 Đã hủy',
                    ])
                    ->placeholder('Tất cả trạng thái'),

                Tables\Filters\Filter::make('today')
                    ->label('Đặt hôm nay')
                    ->query(fn ($query) => $query->whereDate('created_at', today())),

                Tables\Filters\Filter::make('pending_only')
                    ->label('Cần xử lý ngay')
                    ->query(fn ($query) => $query->where('order_status', 'pending')),
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
            // Sắp xếp: pending lên đầu → theo thứ tự xử lý → đơn cũ nhất lên trên trong cùng nhóm
            ->modifyQueryUsing(fn ($query) => $query->orderByRaw("
                CASE order_status
                    WHEN 'pending'    THEN 1
                    WHEN 'processing' THEN 2
                    WHEN 'shipped'    THEN 3
                    WHEN 'delivered'  THEN 4
                    WHEN 'cancelled'  THEN 5
                    ELSE 6
                END ASC,
                created_at ASC
            "));
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
        // ĐẢM BẢO LOAD LẠI ITEMS
        $order->load('items');

        // Duyệt qua từng món trong đơn hàng
        foreach ($order->items as $item) {
            if ($item->product_variants_id) {
                $variant = \App\Models\ProductVariant::find($item->product_variants_id);
                if ($variant) {
                    $variant->increment('stock', $item->quantity);
                }
            }
        }
    }

    /**
     * Trả về danh sách các trạng thái được phép chuyển đến từ trạng thái hiện tại.
     * Luồng hợp lệ:
     *   pending → processing
     *   processing → shipped
     *   shipped → delivered
     *   pending/processing → cancelled
     *   delivered/cancelled → (không đổi được)
     */
    protected static function getAllowedTransitions(?string $currentStatus): array
    {
        $currentStatus = $currentStatus ?? 'pending';
        $allLabels = [
            'pending'    => 'Chờ xử lý',
            'processing' => 'Đang đóng gói',
            'shipped'    => 'Đang vận chuyển',
            'delivered'  => 'Đã giao hàng',
            'cancelled'  => 'Đã hủy',
        ];

        // Chỉ cho phép chuyển sang các trạng thái sau (bao gồm trạng thái hiện tại để giữ nguyên)
        $nextSteps = match ($currentStatus) {
            'pending'    => ['pending', 'processing', 'cancelled'],
            'processing' => ['processing', 'shipped', 'cancelled'],
            'shipped'    => ['shipped', 'delivered'],
            'delivered'  => ['delivered'],   // Khoá: không đổi được
            'cancelled'  => ['cancelled'],   // Khoá: không đổi được
            default      => array_keys($allLabels),
        };

        return array_intersect_key($allLabels, array_flip($nextSteps));
    }

    /**
     * Trả về thông báo lỗi cụ thể khi chuyển trạng thái không hợp lệ.
     */
    protected static function getTransitionErrorMessage(string $from, string $to): string
    {
        $labels = [
            'pending'    => 'Chờ xử lý',
            'processing' => 'Đang đóng gói',
            'shipped'    => 'Đang vận chuyển',
            'delivered'  => 'Đã giao hàng',
            'cancelled'  => 'Đã hủy',
        ];

        $fromLabel = $labels[$from] ?? $from;
        $toLabel   = $labels[$to]   ?? $to;

        // Phát hiện loại lỗi
        $order = ['pending' => 1, 'processing' => 2, 'shipped' => 3, 'delivered' => 4, 'cancelled' => 5];
        $fromIdx = $order[$from] ?? 0;
        $toIdx   = $order[$to]   ?? 0;

        if ($to === 'cancelled' && in_array($from, ['shipped', 'delivered'])) {
            return "Không thể hủy đơn hàng đang ở trạng thái \"$fromLabel\". Chỉ hủy được khi đơn đang Chờ xử lý hoặc Đang đóng gói.";
        }

        if ($toIdx < $fromIdx) {
            return "Không thể quay lại trạng thái \"$toLabel\" từ \"$fromLabel\". Đơn hàng chỉ tiến về phía trước.";
        }

        return "Không thể chuyển từ \"$fromLabel\" sang \"$toLabel\". Phải theo thứ tự: Chờ xử lý → Đang đóng gói → Đang vận chuyển → Đã giao hàng.";
    }
}
