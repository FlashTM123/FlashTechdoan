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
                TextInput::make('name')->label('Tên Nhà Cung Cấp')->required(),
                TextInput::make('phone')->label('Số Điện Thoại')->tel(),
                TextInput::make('email')->label('Email')->email(),
                TextInput::make('address')->label('Địa Chỉ')->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')->label('Tên Nhà Cung Cấp')->searchable()->sortable(),
                TextColumn::make('phone')->label('Số Điện Thoại'),
                TextColumn::make('email')->label('Email'),
                TextColumn::make('created_at')->label('Ngày Tạo')->date('d/m/Y'),
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
