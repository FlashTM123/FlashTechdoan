<?php

namespace App\Filament\Resources\Customers;

use App\Filament\Resources\Customers\Pages\ListCustomers;
use App\Models\User;
use Filament\Forms;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class CustomerResource extends Resource
{
    protected static ?string $model = User::class;

    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-user-group';

    protected static \UnitEnum|string|null $navigationGroup = 'Kinh doanh';
    
    protected static ?int $navigationSort = 1;

    protected static ?string $navigationLabel = 'Khách hàng';

    protected static ?string $modelLabel = 'Khách hàng';

    protected static ?string $pluralModelLabel = 'Khách hàng';

    /**
     * Chỉ lấy những User có role là customer
     */
    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()->where('role', 'customer');
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Forms\Components\Section::make('👤 Thông Tin Tài Khoản')
                ->description('Thông tin định danh cơ bản của khách hàng')
                ->icon('heroicon-o-user')
                ->schema([
                    Forms\Components\TextInput::make('name')
                        ->label('Tên khách hàng')
                        ->prefix('👤')
                        ->disabled()
                        ->maxLength(255),

                    Forms\Components\TextInput::make('email')
                        ->label('Email đăng ký')
                        ->email()
                        ->prefix('✉️')
                        ->disabled()
                        ->maxLength(255),
                    
                    Forms\Components\Toggle::make('is_active')
                        ->label('Trạng thái kích hoạt tài khoản')
                        ->default(true),
                ])->columns(2),

            Forms\Components\Section::make('ℹ️ Thông Tin Bổ Sung')
                ->description('Chi tiết số điện thoại liên lạc, địa chỉ giao nhận hàng và điểm thưởng tích luỹ')
                ->icon('heroicon-o-information-circle')
                ->schema([
                    Forms\Components\TextInput::make('profile.phone')
                        ->label('Số điện thoại')
                        ->placeholder('Nhập số điện thoại liên hệ...')
                        ->prefix('📞')
                        ->maxLength(20),

                    Forms\Components\TextInput::make('profile.address')
                        ->label('Địa chỉ giao hàng')
                        ->placeholder('Nhập địa chỉ chi tiết...')
                        ->prefix('📍')
                        ->maxLength(255),

                    Forms\Components\TextInput::make('profile.points')
                        ->label('Điểm tích lũy')
                        ->numeric()
                        ->prefix('🏆')
                        ->default(0),
                ])->columns(3),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Tên khách hàng')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),

                Tables\Columns\TextColumn::make('email')
                    ->label('Email')
                    ->searchable()
                    ->copyable()
                    ->icon('heroicon-m-envelope')
                    ->sortable(),

                Tables\Columns\TextColumn::make('profile.phone')
                    ->label('Số điện thoại')
                    ->copyable()
                    ->icon('heroicon-m-phone')
                    ->searchable(),

                Tables\Columns\TextColumn::make('profile.points')
                    ->label('Điểm tích luỹ')
                    ->badge()
                    ->color('success')
                    ->icon('heroicon-m-trophy')
                    ->sortable(),

                Tables\Columns\ToggleColumn::make('is_active')
                    ->label('Trạng thái kích hoạt')
                    ->sortable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Ngày tham gia')
                    ->dateTime('d/m/Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('Trạng thái hoạt động')
                    ->trueLabel('Đang hoạt động')
                    ->falseLabel('Bị khóa'),
            ])
            ->actions([
                \Filament\Actions\EditAction::make()->label('Sửa'),
                \Filament\Actions\DeleteAction::make()->label('Xóa'),
            ])
            ->bulkActions([
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
            'index' => ListCustomers::route('/'),
        ];
    }
}
