<?php

// ĐÃ SỬA: Khớp chuẩn xác với thư mục Suppliers của Minh
namespace App\Filament\Resources\Suppliers;

use App\Filament\Resources\Suppliers\Pages\ListSuppliers;
use App\Filament\Resources\Suppliers\Pages\CreateSupplier;
use App\Filament\Resources\Suppliers\Pages\EditSupplier;
use App\Models\Supplier;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use Filament\Forms\Components\TextInput;
use Filament\Tables\Columns\TextColumn;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Grid;

class SupplierResource extends Resource
{
    protected static ?string $model = Supplier::class;
    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-building-office';
    protected static ?string $navigationLabel = 'Nhà cung cấp';
    protected static ?string $modelLabel = 'Nhà cung cấp';
    protected static ?string $pluralModelLabel = 'Nhà cung cấp';
    protected static \UnitEnum|string|null $navigationGroup = 'Quản lý kho vận';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('🏢 Thông Tin Nhà Cung Cấp')
                    ->description('Cập nhật các thông tin liên hệ và địa chỉ của nhà cung cấp')
                    ->icon('heroicon-o-building-office-2')
                    ->schema([
                        Grid::make(2)->schema([
                            TextInput::make('name')
                                ->label('Tên Nhà Cung Cấp')
                                ->placeholder('Ví dụ: Công ty Công nghệ FlashTech...')
                                ->prefix('🏢')
                                ->required(),

                            TextInput::make('phone')
                                ->label('Số Điện Thoại')
                                ->tel()
                                ->placeholder('Ví dụ: 0987654321...')
                                ->prefix('📞')
                                ->maxLength(20),
                        ]),

                        Grid::make(2)->schema([
                            TextInput::make('email')
                                ->label('Email Liên Hệ')
                                ->email()
                                ->placeholder('Ví dụ: contact@flashtech.vn...')
                                ->prefix('✉️')
                                ->maxLength(255),

                            TextInput::make('address')
                                ->label('Địa Chỉ Trụ Sở')
                                ->placeholder('Ví dụ: 123 Đường Cầu Giấy, Hà Nội...')
                                ->prefix('📍')
                                ->maxLength(255),
                        ]),
                    ])
                    ->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->label('Tên Nhà Cung Cấp')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                TextColumn::make('phone')
                    ->label('Số Điện Thoại')
                    ->searchable()
                    ->copyable()
                    ->icon('heroicon-m-phone'),
                TextColumn::make('email')
                    ->label('Email')
                    ->searchable()
                    ->copyable()
                    ->icon('heroicon-m-envelope'),
                TextColumn::make('created_at')
                    ->label('Ngày Tạo')
                    ->date('d/m/Y')
                    ->sortable(),
            ])
            ->actions([
                \Filament\Actions\EditAction::make(),
                \Filament\Actions\DeleteAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        // ĐÃ SỬA: Gọi chuẩn đường dẫn định tuyến trang con của thư mục Suppliers
        return [
            'index' => ListSuppliers::route('/'),
            // 'create' => CreateSupplier::route('/create'),
            // 'edit' => EditSupplier::route('/{record}/edit'),
        ];
    }

}
