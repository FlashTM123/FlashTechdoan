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
use Filament\Schemas\Components\Section;

use Filament\Tables\Actions\EditAction;
use Filament\Tables\Actions\ViewAction; // Nạp thêm nút Xem chi tiết chuẩn v5
use Filament\Tables\Actions\DeleteAction;
use Filament\Tables\Columns\TextColumn;
use Illuminate\Support\Facades\Auth;

class StockImportResource extends Resource
{
    protected static ?string $model = StockImport::class;
    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-arrow-down-tray';
    protected static ?string $navigationLabel = 'Quản lý nhập kho';
    protected static ?string $modelLabel = 'Phiếu nhập kho';
    protected static ?string $pluralModelLabel = 'Phiếu nhập kho';
    protected static \UnitEnum|string|null $navigationGroup = 'Quản lý kho vận';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Thông tin chung phiếu nhập')
                    ->schema([
                        TextInput::make('import_code')
                            ->label('Mã Phiếu Nhập')
                            ->disabled()
                            ->dehydrated()
                            ->default(function () {
                                $date = now()->format('Ymd');
                                $lastImport = StockImport::where('import_code', 'like', "SI-{$date}-%")->latest()->first();
                                if ($lastImport) {
                                    $lastNumber = intval(substr($lastImport->import_code, -4));
                                    $newNumber = str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
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
                            ->disabled(fn ($record) => $record?->import_status === 'completed'),

                        Select::make('supplier_id')
                            ->label('Nhà Cung Cấp')
                            ->options(Supplier::pluck('name', 'id'))
                            ->searchable()
                            ->required()
                            ->disabled(fn ($record) => $record?->import_status === 'completed'),

                        Select::make('import_status')
                            ->label('Trạng Thái Phiếu')
                            ->options([
                                'pending' => 'Chờ Xử Lý (Pending)',
                                'completed' => 'Hoàn Thành (Completed)',
                            ])
                            ->default('pending')
                            ->required()
                            ->disabled(fn ($record) => $record === null || $record->import_status === 'completed'),

                        Select::make('admin_id')
                            ->label('Người tạo phiếu')
                            ->options(User::pluck('name', 'id'))
                            ->default(fn () => Auth::id())
                            ->disabled()
                            ->dehydrated(),
                    ])->columns(2),

                Section::make('Chi tiết các mặt hàng nhập')
                    ->schema([
                        Repeater::make('details')
                            ->relationship()
                            ->label('Danh sách máy nhập về')
                            ->schema([
                                Select::make('product_variant_id')
                                    ->label('Chọn Laptop / Cấu hình')
                                    ->options(ProductVariant::all()->mapWithKeys(function ($variant) {
                                        return [$variant->id => "{$variant->product?->name} - {$variant->title} (SKU: {$variant->sku})"];
                                    }))
                                    ->required()
                                    ->searchable()
                                    ->columnSpan(5),

                                TextInput::make('quantity')
                                    ->label('Số Lượng')
                                    ->numeric()
                                    ->required()
                                    ->minValue(1)
                                    ->columnSpan(2),

                                TextInput::make('unit_price')
                                    ->label('Giá Nhập (VNĐ)')
                                    ->numeric()
                                    ->required()
                                    ->columnSpan(3),

                                TextInput::make('supplier_sku')
                                    ->label('SKU Đối Tác')
                                    ->columnSpan(2),
                            ])
                            ->columns(12)
                            ->columnSpanFull()
                            ->disabled(fn ($record) => $record?->import_status === 'completed'),
                    ]),

                Section::make('Ghi chú')
                    ->schema([
                        Textarea::make('notes')
                            ->label('Ghi chú nội bộ')
                            ->rows(2)
                            ->disabled(fn ($record) => $record?->import_status === 'completed'),
                    ])
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('import_code')->label('Mã Phiếu')->searchable()->sortable(),
                TextColumn::make('supplier.name')->label('Nhà Cung Cấp')->searchable(),
                TextColumn::make('import_date')->label('Ngày Nhập')->date('d/m/Y')->sortable(),
                TextColumn::make('admin.name')->label('Người Tạo Phiếu'),
                TextColumn::make('details_sum_quantity')->sum('details', 'quantity')->label('Tổng SL Nhập')->badge()->color('info'),
                TextColumn::make('import_status')
                    ->label('Trạng Thái')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'pending' => 'warning',
                        'completed' => 'success',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'pending' => 'Chờ Xử Lý',
                        'completed' => 'Hoàn Thành',
                        default => $state,
                    }),
            ])
            ->actions([
                // ĐÃ SỬA: Khi đã Hoàn thành thì hiện nút "Xem", nếu chưa Hoàn thành thì hiện nút "Sửa"
                \Filament\Actions\EditAction::make()->visible(fn ($record) => $record->import_status !== 'completed'),
                \Filament\Actions\ViewAction::make()->visible(fn ($record) => $record->import_status === 'completed')->label('Xem chi tiết'),
                \Filament\Actions\DeleteAction::make()->disabled(fn ($record) => $record->import_status === 'completed'),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListStockImports::route('/'),
            'create' => Pages\CreateStockImport::route('/create'),
            'view' => Pages\ViewStockImport::route('/{record}'), // Đăng ký trang View chuẩn v5
            'edit' => Pages\EditStockImport::route('/{record}/edit'),
        ];
    }
}
