<?php

namespace App\Filament\Resources\StockImports;

use App\Filament\Resources\StockImports\Pages;
use App\Models\StockImport;
use App\Models\ProductVariant;
use App\Models\User;
use App\Models\Supplier;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Placeholder;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Grid;

use Filament\Tables\Actions\EditAction;
use Filament\Tables\Actions\ViewAction;
use Filament\Tables\Actions\DeleteAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Filters\SelectFilter;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Number;

class StockImportResource extends Resource
{
    protected static ?string $model = StockImport::class;
    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-archive-box-arrow-down';
    protected static ?string $navigationLabel = 'Nhập Kho';
    protected static ?string $modelLabel = 'Phiếu Nhập Kho';
    protected static ?string $pluralModelLabel = 'Danh Sách Phiếu Nhập Kho';
    protected static \UnitEnum|string|null $navigationGroup = 'Quản lý kho vận';
    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([

                // ═══════════════════════════════════════════════════
                // SECTION 1 — THÔNG TIN PHIẾU NHẬP
                // ═══════════════════════════════════════════════════
                Section::make()
                    ->heading('📋 Thông Tin Phiếu Nhập')
                    ->description('Điền đầy đủ thông tin chung của phiếu nhập kho')
                    ->icon('heroicon-o-document-text')
                    ->schema([
                        Grid::make(2)->schema([
                            // Cột trái
                            TextInput::make('import_code')
                                ->label('Mã Phiếu Nhập')
                                ->helperText('Mã được tạo tự động theo ngày nhập kho')
                                ->prefix('📄')
                                ->disabled()
                                ->dehydrated()
                                ->default(function () {
                                    $date = now()->format('Ymd');
                                    $lastImport = StockImport::where('import_code', 'like', "SI-{$date}-%")->latest()->first();
                                    if ($lastImport) {
                                        $lastNumber = intval(substr($lastImport->import_code, -4));
                                        $newNumber  = str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
                                    } else {
                                        $newNumber = '0001';
                                    }
                                    return "SI-{$date}-{$newNumber}";
                                })
                                ->required(),

                            DatePicker::make('import_date')
                                ->label('Ngày Nhập Kho')
                                ->required()
                                ->default(now())
                                ->native(false)
                                ->displayFormat('d/m/Y')
                                ->helperText('Ngày hàng về kho thực tế')
                                ->disabled(fn ($record) => $record?->import_status === 'completed'),
                        ]),

                        Grid::make(2)->schema([
                            Select::make('supplier_id')
                                ->label('Nhà Cung Cấp')
                                ->placeholder('Tìm nhà cung cấp…')
                                ->options(Supplier::pluck('name', 'id'))
                                ->searchable()
                                ->required()
                                ->helperText('Chọn nhà cung cấp cho lô hàng này')
                                ->disabled(fn ($record) => $record?->import_status === 'completed'),

                            Select::make('import_status')
                                ->label('Trạng Thái Phiếu')
                                ->options([
                                    'pending'   => '🕐 Chờ Xử Lý',
                                    'completed' => '✅ Hoàn Thành',
                                ])
                                ->default('pending')
                                ->required()
                                ->helperText('Chỉ phiếu "Hoàn Thành" mới cập nhật vào tồn kho')
                                ->native(false)
                                ->disabled(fn ($record) => $record === null || $record->import_status === 'completed'),
                        ]),

                        Grid::make(2)->schema([
                            Select::make('admin_id')
                                ->label('Người Tạo Phiếu')
                                ->options(User::pluck('name', 'id'))
                                ->default(fn () => Auth::id())
                                ->disabled()
                                ->dehydrated()
                                ->helperText('Được gán tự động theo tài khoản đang đăng nhập'),

                            Textarea::make('notes')
                                ->label('Ghi Chú Nội Bộ')
                                ->placeholder('Nhập ghi chú nếu có (nguồn hàng, điều kiện giao nhận…)')
                                ->rows(2)
                                ->disabled(fn ($record) => $record?->import_status === 'completed'),
                        ]),
                    ])
                    ->columnSpanFull(),

                // ═══════════════════════════════════════════════════
                // SECTION 2 — CHI TIẾT MẶT HÀNG NHẬP
                // ═══════════════════════════════════════════════════
                Section::make()
                    ->heading('📦 Danh Sách Mặt Hàng Nhập')
                    ->description('Thêm từng sản phẩm, số lượng và đơn giá nhập vào lô hàng này')
                    ->icon('heroicon-o-shopping-cart')
                    ->schema([
                        Repeater::make('details')
                            ->relationship()
                            ->label('')
                            ->schema([
                                Select::make('product_variant_id')
                                    ->label('Laptop / Cấu Hình')
                                    ->placeholder('🔍 Tìm theo tên hoặc SKU…')
                                    ->options(ProductVariant::all()->mapWithKeys(function ($variant) {
                                        return [$variant->id => "{$variant->product?->name} — {$variant->variant_name} (SKU: {$variant->sku})"];
                                    }))
                                    ->required()
                                    ->searchable()
                                    ->columnSpan(5),

                                TextInput::make('quantity')
                                    ->label('Số Lượng')
                                    ->numeric()
                                    ->required()
                                    ->minValue(1)
                                    ->default(1)
                                    ->suffix('máy')
                                    ->reactive()
                                    ->afterStateUpdated(function ($state, $get, $set) {
                                        $unitPrice = (float) $get('unit_price');
                                        $set('subtotal', (int)$state * $unitPrice);
                                    })
                                    ->columnSpan(2),

                                TextInput::make('unit_price')
                                    ->label('Đơn Giá Nhập (₫)')
                                    ->numeric()
                                    ->required()
                                    ->prefix('₫')
                                    ->placeholder('0')
                                    ->reactive()
                                    ->afterStateUpdated(function ($state, $get, $set) {
                                        $quantity = (int) $get('quantity');
                                        $set('subtotal', $quantity * (float)$state);
                                    })
                                    ->columnSpan(3),

                                TextInput::make('subtotal')
                                    ->label('Thành Tiền (₫)')
                                    ->prefix('₫')
                                    ->numeric()
                                    ->disabled()
                                    ->dehydrated(false)
                                    ->placeholder('0')
                                    ->helperText('Tự động tính')
                                    ->afterStateHydrated(function ($state, $get, $set) {
                                        $quantity  = (int) $get('quantity');
                                        $unitPrice = (float) $get('unit_price');
                                        $set('subtotal', $quantity * $unitPrice);
                                    })
                                    ->columnSpan(2),
                            ])
                            ->columns(12)
                            ->columnSpanFull()
                            ->addActionLabel('＋ Thêm mặt hàng vào phiếu')
                            ->reorderableWithButtons()
                            ->cloneable()
                            ->itemLabel(fn (array $state): ?string => $state['product_variant_id']
                                ? 'Dòng #' . ($state['product_variant_id'])
                                : 'Mặt hàng mới'
                            )
                            ->disabled(fn ($record) => $record?->import_status === 'completed'),
                    ])
                    ->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('import_code')
                    ->label('Mã Phiếu')
                    ->searchable()
                    ->sortable()
                    ->copyable()
                    ->copyMessage('Đã sao chép mã phiếu!')
                    ->weight(\Filament\Support\Enums\FontWeight::Bold)
                    ->icon('heroicon-m-document-text'),

                TextColumn::make('supplier.name')
                    ->label('Nhà Cung Cấp')
                    ->searchable()
                    ->icon('heroicon-m-building-office'),

                TextColumn::make('import_date')
                    ->label('Ngày Nhập')
                    ->date('d/m/Y')
                    ->sortable()
                    ->icon('heroicon-m-calendar'),

                TextColumn::make('admin.name')
                    ->label('Người Tạo')
                    ->icon('heroicon-m-user'),

                TextColumn::make('details_sum_quantity')
                    ->sum('details', 'quantity')
                    ->label('Tổng SL')
                    ->badge()
                    ->color('info')
                    ->suffix(' máy'),

                TextColumn::make('import_status')
                    ->label('Trạng Thái')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'pending'   => 'warning',
                        'completed' => 'success',
                        default     => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'pending'   => '🕐 Chờ Xử Lý',
                        'completed' => '✅ Hoàn Thành',
                        default     => $state,
                    }),

                TextColumn::make('created_at')
                    ->label('Tạo Lúc')
                    ->dateTime('H:i d/m/Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                SelectFilter::make('import_status')
                    ->label('Trạng Thái')
                    ->options([
                        'pending'   => 'Chờ Xử Lý',
                        'completed' => 'Hoàn Thành',
                    ]),
            ])
            ->actions([
                \Filament\Actions\EditAction::make()
                    ->icon('heroicon-m-pencil-square')
                    ->visible(fn ($record) => $record->import_status !== 'completed'),

                \Filament\Actions\ViewAction::make()
                    ->icon('heroicon-m-eye')
                    ->label('Xem chi tiết')
                    ->visible(fn ($record) => $record->import_status === 'completed'),

                \Filament\Actions\DeleteAction::make()
                    ->icon('heroicon-m-trash')
                    ->visible(fn ($record) => $record->import_status !== 'completed'),
            ])
            ->emptyStateIcon('heroicon-o-archive-box')
            ->emptyStateHeading('Chưa có phiếu nhập kho nào')
            ->emptyStateDescription('Bấm "Tạo phiếu nhập" để bắt đầu nhập lô hàng mới vào kho.');


    }

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListStockImports::route('/'),
            'create' => Pages\CreateStockImport::route('/create'),
            'view'   => Pages\ViewStockImports::route('/{record}'),
            'edit'   => Pages\EditStockImport::route('/{record}/edit'),
        ];
    }
}
