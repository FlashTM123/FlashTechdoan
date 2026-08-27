<?php

namespace App\Filament\Resources\Categories;

use App\Filament\Resources\Categories\Pages\ListCategories;
use App\Models\Category;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class CategoryResource extends Resource
{
    protected static ?string $model = Category::class;

    protected static \UnitEnum|string|null $navigationGroup = 'Quản lý sản phẩm';
    protected static ?string $modelLabel = 'Danh mục sản phẩm';
    protected static ?string $pluralModelLabel = 'Danh sách danh mục sản phẩm';

    protected static ?int $navigationSort = 1;

    protected static ?string $navigationLabel = 'Danh mục sản phẩm';

    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-squares-2x2';


    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            \Filament\Schemas\Components\Section::make('📁 Danh Mục Sản Phẩm')
                ->description('Quản lý thông tin phân loại sản phẩm trong hệ thống')
                ->icon('heroicon-o-squares-2x2')
                ->schema([
                    \Filament\Schemas\Components\Grid::make(2)->schema([
                        Forms\Components\TextInput::make('name')
                            ->label('Tên danh mục')
                            ->placeholder('Ví dụ: Laptop Gaming, Laptop Văn Phòng...')
                            ->prefix('📁')
                            ->required()
                            ->maxLength(255)
                            ->live(debounce: 500)
                            ->afterStateUpdated(fn ($set, ?string $state) => $set('slug', Str::slug($state))),

                        Forms\Components\TextInput::make('slug')
                            ->label('Slug (Đường dẫn tự động)')
                            ->placeholder('slug-tu-dong-tao')
                            ->prefix('🔗')
                            ->required()
                            ->unique(table: 'categories', column: 'slug', ignoreRecord: true)
                            ->maxLength(255),
                    ]),

                    Forms\Components\Toggle::make('is_active')
                        ->label('Kích hoạt danh mục này hiển thị ngoài trang chủ')
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
                    ->label('Tên danh mục')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),

                Tables\Columns\TextColumn::make('slug')
                    ->label('Slug (Đường dẫn)')
                    ->fontFamily('mono')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\ToggleColumn::make('is_active')
                    ->label('Kích hoạt')
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

    public static function getPages(): array
    {
        return [
            'index' => ListCategories::route('/'),
        ];
    }
}
