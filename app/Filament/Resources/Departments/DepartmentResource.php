<?php

namespace App\Filament\Resources\Departments;

use App\Filament\Resources\Departments\Pages\CreateDepartment;
use App\Filament\Resources\Departments\Pages\EditDepartment;
use App\Filament\Resources\Departments\Pages\ListDepartments;
use App\Models\Department;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class DepartmentResource extends Resource
{
    protected static ?string $model = Department::class;

    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-building-office';
    protected static ?string $navigationLabel = 'Quản lý phòng ban';
    protected static ?string $modelLabel = 'Phòng ban';
    protected static ?string $pluralModelLabel = 'Danh sách phòng ban';
    protected static \UnitEnum|string|null $navigationGroup = 'Hệ thống';

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            \Filament\Schemas\Components\Section::make('🏢 Thông Tin Phòng Ban')
                ->description('Khai báo phòng ban mới và mô tả chức năng hoạt động chính')
                ->icon('heroicon-o-building-office')
                ->schema([
                    \Filament\Schemas\Components\Grid::make(2)->schema([
                        Forms\Components\TextInput::make('name')
                            ->label('Tên phòng ban')
                            ->placeholder('Ví dụ: Phòng Kỹ thuật, Phòng Kinh doanh...')
                            ->prefix('🏢')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('code')
                            ->label('Mã phòng ban')
                            ->placeholder('Ví dụ: KT, KD...')
                            ->prefix('🆔')
                            ->required()
                            ->maxLength(50)
                            ->unique(ignoreRecord: true),
                    ]),
                    Forms\Components\Textarea::make('description')
                        ->label('Mô tả chức năng')
                        ->placeholder('Nhập mô tả chi tiết nhiệm vụ của phòng ban...')
                        ->rows(3)
                        ->columnSpan('full'),
                ])
                ->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Tên phòng ban')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                Tables\Columns\TextColumn::make('code')
                    ->label('Mã phòng ban')
                    ->fontFamily('mono')
                    ->copyable()
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('description')
                    ->label('Mô tả')
                    ->limit(50),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Ngày tạo')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
            ])
            ->filters([
                //
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
            'index' => ListDepartments::route('/'),
           
        ];
    }
}
