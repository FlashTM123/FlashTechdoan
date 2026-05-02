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

    public static function infolist(\Filament\Schemas\Schema $schema): \Filament\Schemas\Schema
    {
        return $schema->components([
            // HEADER: Ảnh + Tên + Huy hiệu
            \Filament\Schemas\Components\Section::make()
                ->schema([
                    \Filament\Schemas\Components\Flex::make([
                        \Filament\Schemas\Components\Image::make(
                            fn ($record) => (str_starts_with($record->thumbnail_url ?? '', 'http'))
                                ? $record->thumbnail_url
                                : asset('storage/' . ($record->thumbnail_url ?? 'placeholder.png')),
                            'Thumbnail'
                        )
                            ->extraAttributes(['class' => 'rounded-xl object-cover w-20 h-20'])
                            ->imageSize(80)
                            ->grow(false),

                        \Filament\Schemas\Components\Group::make([
                            \Filament\Schemas\Components\Text::make(fn ($record) => $record->name)
                                ->weight('bold')
                                ->size('xl'),
                            \Filament\Schemas\Components\Flex::make([
                                \Filament\Schemas\Components\Text::make(fn ($record) => $record->brand?->name ?? '—')
                                    ->badge()
                                    ->color('gray'),
                                \Filament\Schemas\Components\Text::make(fn ($record) => $record->category?->name ?? '—')
                                    ->badge()
                                    ->color('info'),
                                \Filament\Schemas\Components\Text::make(fn ($record) => $record->is_featured ? 'Nổi bật' : null)
                                    ->badge()
                                    ->color('warning')
                                    ->hidden(fn ($record) => !$record->is_featured),
                                \Filament\Schemas\Components\Text::make(fn ($record) => $record->is_active ? 'Đang bán' : 'Ngừng bán')
                                    ->badge()
                                    ->color(fn ($record) => $record->is_active ? 'success' : 'danger'),
                            ])->gap(2),
                        ])->grow()->gap(1),
                    ])->alignCenter()->extraAttributes(['class' => 'gap-4']),
                ]),

            // GIÁ BÁN (từ variants)
            \Filament\Schemas\Components\Section::make('Giá bán')
                ->icon('heroicon-o-currency-dollar')
                ->schema([
                    \Filament\Schemas\Components\Flex::make([
                        \Filament\Schemas\Components\Group::make([
                            \Filament\Schemas\Components\Text::make('Giá thấp nhất')->color('gray')->size('sm'),
                            \Filament\Schemas\Components\Text::make(
                                fn ($record) => number_format($record->variants->min('price') ?? 0, 0, ',', '.') . ' ₫'
                            )->weight('bold')->color('primary'),
                        ])->grow()->gap(0),
                        \Filament\Schemas\Components\Group::make([
                            \Filament\Schemas\Components\Text::make('Giá cao nhất')->color('gray')->size('sm'),
                            \Filament\Schemas\Components\Text::make(
                                fn ($record) => number_format($record->variants->max('price') ?? 0, 0, ',', '.') . ' ₫'
                            )->weight('bold'),
                        ])->grow()->gap(0),
                        \Filament\Schemas\Components\Group::make([
                            \Filament\Schemas\Components\Text::make('Tổng tồn kho')->color('gray')->size('sm'),
                            \Filament\Schemas\Components\Text::make(
                                fn ($record) => $record->variants->sum('stock') . ' sản phẩm'
                            )->weight('bold')->color('success'),
                        ])->grow()->gap(0),
                    ])->alignBetween(),
                ]),

            // BIẾN THỂ
            \Filament\Schemas\Components\Section::make('Biến thể sản phẩm')
                ->icon('heroicon-o-squares-2x2')
                ->schema(fn ($record) => $record->variants->map(fn ($v) =>
                    \Filament\Schemas\Components\Flex::make([
                        \Filament\Schemas\Components\Group::make([
                            \Filament\Schemas\Components\Text::make($v->variant_name ?? '—')->weight('semibold'),
                            \Filament\Schemas\Components\Text::make($v->sku ?? '—')->color('gray')->size('sm'),
                        ])->grow()->gap(0),
                        \Filament\Schemas\Components\Group::make([
                            \Filament\Schemas\Components\Text::make(number_format($v->price, 0, ',', '.') . ' ₫')
                                ->weight('bold')->color('primary'),
                            \Filament\Schemas\Components\Text::make('Tồn: ' . $v->stock)
                                ->size('sm')->color($v->stock > 0 ? 'success' : 'danger'),
                        ])->grow(false)->gap(0),
                    ])->alignCenter()->extraAttributes(['class' => 'py-3 border-b last:border-0 gap-3'])
                )->toArray()),

            // MÔ TẢ
            \Filament\Schemas\Components\Section::make('Mô tả sản phẩm')
                ->icon('heroicon-o-document-text')
                ->collapsed()
                ->schema([
                    \Filament\Schemas\Components\Text::make(
                        fn ($record) => strip_tags($record->description ?? 'Chưa có mô tả.')
                    )->extraAttributes(['class' => 'text-sm leading-relaxed text-gray-600 dark:text-gray-400']),
                ]),
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
                \Filament\Actions\ViewAction::make()
                    ->slideOver()
                    ->modalWidth(\Filament\Support\Enums\Width::FourExtraLarge),
                \Filament\Actions\EditAction::make(),
                \Filament\Actions\DeleteAction::make()
                    ->hidden(fn () => !auth()->user()->isStaff()),
            ])
            ->bulkActions([
                \Filament\Actions\BulkActionGroup::make([
                    \Filament\Actions\DeleteBulkAction::make()
                        ->hidden(fn () => !auth()->user()->isStaff()),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListProducts::route('/'),
            'create' => CreateProduct::route('/create'),
            'edit' => EditProduct::route('/{record}/edit'),
        ];
    }
}
