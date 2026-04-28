<?php

namespace App\Filament\Resources\Brands;

use App\Filament\Resources\Brands\Pages\ListBrands;
use App\Models\Brand;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class BrandResource extends Resource
{
    protected static ?string $model = Brand::class;
    protected static \UnitEnum|string|null $navigationGroup = 'Quản lý sản phẩm';
    protected static ?int $navigationSort = 2;
    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-bookmark-square';
    protected static ?string $navigationLabel = 'Thương hiệu';
    

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Forms\Components\TextInput::make('name')
                ->label('Tên thương hiệu')
                ->required()
                ->maxLength(255)
                ->live(debounce: 500)
                ->afterStateUpdated(fn ($set, ?string $state) => $set('slug', Str::slug($state))),

            Forms\Components\TextInput::make('slug')
                ->label('Slug (Đường dẫn)')
                ->required()
                ->unique(table: 'brands', column: 'slug', ignoreRecord: true)
                ->maxLength(255),

            Forms\Components\TextInput::make('logo_url')
                ->label('Link ảnh Logo (URL)')
                ->url()
                ->placeholder('https://example.com/logo.png'),

            Forms\Components\Toggle::make('is_active')
                ->label('Kích hoạt')
                ->default(true),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Tên thương hiệu')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('slug')
                    ->label('Slug'),

                Tables\Columns\ImageColumn::make('logo_url')
                    ->label('Logo'),

                Tables\Columns\IconColumn::make('is_active')
                    ->label('Trạng thái')
                    ->boolean(),
            ])
            ->recordActions([
                \Filament\Actions\EditAction::make(),
                \Filament\Actions\DeleteAction::make(),
            ])
            ->toolbarActions([
                \Filament\Actions\BulkActionGroup::make([
                    \Filament\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListBrands::route('/'),
        ];
    }
}
