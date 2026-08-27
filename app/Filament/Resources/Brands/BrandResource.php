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
    protected static ?string $modelLabel = 'Thương hiệu';
    protected static ?string $pluralModelLabel = 'Danh sách thương hiệu';
    protected static ?int $navigationSort = 2;
    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-bookmark-square';
    protected static ?string $navigationLabel = 'Thương hiệu';


    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            \Filament\Schemas\Components\Section::make('🏷️ Thương Hiệu Sản Phẩm')
                ->description('Quản lý thông tin và logo hãng sản xuất liên kết')
                ->icon('heroicon-o-bookmark-square')
                ->schema([
                    \Filament\Schemas\Components\Grid::make(2)->schema([
                        Forms\Components\TextInput::make('name')
                            ->label('Tên thương hiệu')
                            ->placeholder('Ví dụ: Dell, Asus, Apple, HP...')
                            ->prefix('🏷️')
                            ->required()
                            ->maxLength(255)
                            ->live(debounce: 500)
                            ->afterStateUpdated(fn ($set, ?string $state) => $set('slug', Str::slug($state))),

                        Forms\Components\TextInput::make('slug')
                            ->label('Slug (Đường dẫn tự động)')
                            ->placeholder('slug-tu-dong-tao')
                            ->prefix('🔗')
                            ->required()
                            ->unique(table: 'brands', column: 'slug', ignoreRecord: true)
                            ->maxLength(255),
                    ]),

                    Forms\Components\FileUpload::make('image_path')
                        ->label('Logo thương hiệu')
                        ->image()
                        ->directory('brands')
                        ->preserveFilenames()
                        ->columnSpanFull(),

                    Forms\Components\Toggle::make('is_active')
                        ->label('Kích hoạt hiển thị thương hiệu này')
                        ->default(true),
                ])
                ->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Tên thương hiệu')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),

                Tables\Columns\TextColumn::make('slug')
                    ->label('Slug')
                    ->fontFamily('mono')
                    ->sortable(),

                Tables\Columns\ImageColumn::make('image_path')
                    ->label('Logo')
                    ->circular(),

                Tables\Columns\ToggleColumn::make('is_active')
                    ->label('Trạng thái kích hoạt')
                    ->sortable(),
            ])
            ->recordActions([
                \Filament\Actions\EditAction::make()->label('Sửa'),
                 \Filament\Actions\DeleteAction::make()->label('Xóa'),
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
