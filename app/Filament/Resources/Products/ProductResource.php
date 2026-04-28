<?php

namespace App\Filament\Resources\Products;

use App\Filament\Resources\Products\Pages\CreateProduct;
use App\Filament\Resources\Products\Pages\EditProduct;
use App\Filament\Resources\Products\Pages\ListProducts;
use App\Filament\Resources\Products\Pages\ViewProduct;
use App\Models\Product;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Components\Grid;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\Repeater;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;
    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-computer-desktop';
    protected static ?string $navigationLabel = 'Sản phẩm';
    protected static \UnitEnum|string|null $navigationGroup = 'Quản lý sản phẩm';
    protected static ?int $navigationSort = 3;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Tabs::make('Product Management')
                ->tabs([
                    // TAB 1: THÔNG TIN CHUNG
                    Tab::make('Thông tin chung')
                        ->schema([
                            Grid::make(2)->schema([
                                TextInput::make('name')
                                    ->label('Tên sản phẩm')
                                    ->required()
                                    ->live(debounce: 500)
                                    ->afterStateUpdated(fn ($set, ?string $state) => $set('slug', Str::slug($state))),

                                TextInput::make('slug')
                                    ->label('Slug')
                                    ->required()
                                    ->unique(ignoreRecord: true),
                            ]),

                            Grid::make(2)->schema([
                                Select::make('category_id')
                                    ->label('Danh mục')
                                    ->relationship('category', 'name')
                                    ->required(),
                                Select::make('brand_id')
                                    ->label('Thương hiệu')
                                    ->relationship('brand', 'name')
                                    ->required(),
                            ]),

                            TextInput::make('thumbnail_url')->label('Ảnh Thumbnail')->url(),
                            RichEditor::make('description')
                                ->label('Mô tả')
                                ->rules([
                                    function () {
                                        return function (string $attribute, $value, \Closure $fail) {
                                            if (!is_string($value)) {
                                                return;
                                            }
                                            $cleanText = strip_tags($value);
                                            // Đếm từ hỗ trợ tiếng Việt chuẩn xác
                                            $wordCount = count(preg_split('/\s+/u', trim($cleanText), -1, PREG_SPLIT_NO_EMPTY));

                                            if ($wordCount > 1000) {
                                                $fail("Mô tả không được vượt quá 1000 từ (Hiện tại đang có: {$wordCount} từ).");
                                            }
                                        };
                                    }
                                ]),
                            Toggle::make('is_featured')->label('Nổi bật'),
                            Toggle::make('is_active')->label('Kích hoạt')->default(true),
                        ]),

                    // TAB 2: BIẾN THỂ & THÔNG SỐ RIÊNG (MySQL)
                    Tab::make('Biến thể & Thông số riêng')
                        ->schema([
                            Repeater::make('variants')
                                ->relationship('variants')
                                ->schema([
                                    Grid::make(3)->schema([
                                        TextInput::make('variant_name')->label('Cấu hình (VD: Core i5/8GB)')->required(),
                                        TextInput::make('color')->label('Màu sắc'),
                                        TextInput::make('sku')->label('Mã SKU')->required(),
                                    ]),
                                    Grid::make(3)->schema([
                                        TextInput::make('price')->label('Giá bán')->numeric()->required(),
                                        TextInput::make('old_price')->label('Giá gốc')->numeric(),
                                        TextInput::make('stock')->label('Tồn kho')->numeric()->default(0),
                                    ]),

                                    Repeater::make('specifications')
                                        ->label('Thông số kỹ thuật riêng cho cấu hình này')
                                        ->schema([
                                            TextInput::make('key')->label('Thuộc tính')->required(),
                                            TextInput::make('value')->label('Giá trị')->required(),
                                        ])
                                        ->columns(2)
                                        ->columnSpanFull()
                                ])
                        ]),
                ])->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('thumbnail_url')
                    ->label('Ảnh')
                    ->state(fn ($record) => $record->thumbnail_url),

                Tables\Columns\TextColumn::make('name')
                    ->label('Tên Laptop')
                    ->searchable(),

                Tables\Columns\TextColumn::make('brand.name')
                    ->label('Thương hiệu'),

                Tables\Columns\TextColumn::make('variants_price')
                    ->label('Giá bán')
                    ->state(function ($record) {
                        $minPrice = $record->variants()->min('price');
                        if (!$minPrice) return 'Chưa cập nhật';

                        $minPriceHtml = 'Giá từ: ' . number_format($minPrice, 0, ',', '.') . 'đ';
                        $cheapest = $record->variants()->where('price', $minPrice)->first();

                        if ($cheapest && $cheapest->old_price && $cheapest->old_price > $cheapest->price) {
                            $discount = round((($cheapest->old_price - $cheapest->price) / $cheapest->old_price) * 100);
                            return $minPriceHtml . ' <span style="background-color:#EF4444; color:white; padding:2px 6px; border-radius:9999px; font-size:11px;">-' . $discount . '%</span>';
                        }
                        return $minPriceHtml;
                    })
                    ->html(),
            ])
            ->actions([
                \Filament\Actions\ViewAction::make(),
                \Filament\Actions\EditAction::make(),
                \Filament\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                \Filament\Actions\BulkActionGroup::make([
                    \Filament\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListProducts::route('/'),
            'create' => CreateProduct::route('/create'),
            'view' => ViewProduct::route('/{record}'),
            'edit' => EditProduct::route('/{record}/edit'),
        ];
    }
}
