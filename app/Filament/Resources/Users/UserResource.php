<?php

namespace App\Filament\Resources\Users;

use App\Models\User;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-users';
    protected static ?string $navigationLabel = 'Quản lý nhân viên';
    protected static ?string $modelLabel = 'Nhân viên';
    protected static ?string $pluralModelLabel = 'Danh sách nhân viên';

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Forms\Components\TextInput::make('name')
                ->label('Tên nhân viên')
                ->required(),

            Forms\Components\TextInput::make('email')
                ->label('Email')
                ->email()
                ->required()
                ->unique(ignoreRecord: true),

            Forms\Components\TextInput::make('password')
                ->label('Mật khẩu')
                ->password()
                ->dehydrateStateUsing(fn ($state) => \Illuminate\Support\Facades\Hash::make($state))
                ->dehydrated(fn ($state) => filled($state))
                ->required(fn (string $operation) => $operation === 'create'),

            Forms\Components\TextInput::make('employee_code')
                ->label('Mã nhân viên')
                ->default(fn () => 'NV-' . strtoupper(\Illuminate\Support\Str::random(5)))
                ->disabled()
                ->dehydrated()
                ->unique(ignoreRecord: true),

            Forms\Components\TextInput::make('department')
                ->label('Phòng ban'),

            Forms\Components\Select::make('role')
                ->label('Vai trò')
                ->options([
                    'admin' => 'Admin',
                    'moderator' => 'Moderator',
                    'employee' => 'Nhân viên',
                ])
                ->default('employee')
                ->required(),

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
                    ->label('Tên nhân viên')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('email')
                    ->label('Email')
                    ->searchable(),

                Tables\Columns\TextColumn::make('employee_code')
                    ->label('Mã nhân viên')
                    ->searchable(),

                Tables\Columns\TextColumn::make('department')
                    ->label('Phòng ban'),

                Tables\Columns\TextColumn::make('role')
                    ->label('Vai trò')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'admin' => 'danger',
                        'moderator' => 'warning',
                        default => 'info',
                    }),

                Tables\Columns\IconColumn::make('is_active')
                    ->label('Trạng thái')
                    ->boolean(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('role')
                    ->options([
                        'admin' => 'Admin',
                        'moderator' => 'Moderator',
                        'employee' => 'Nhân viên',
                    ]),
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

    public static function getPages(): array
    {
        return [
            'index' => \App\Filament\Resources\Users\Pages\ListUsers::route('/'),
        ];
    }
}
