<?php

namespace App\Filament\Resources\Users;

use App\Models\User;
use Filament\Forms;
use Filament\Notifications\Notification;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Form\Get;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Grid;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-users';
    protected static ?string $navigationLabel = 'Quản lý nhân viên';
    protected static ?string $modelLabel = 'Nhân viên';
    protected static ?string $pluralModelLabel = 'Danh sách nhân viên';
    protected static \UnitEnum|string|null $navigationGroup = 'Hệ thống';
    protected static ?int $navigationSort = 1;

    /**
     * Chỉ lấy những User KHÔNG PHẢI là customer (Admin, Moderator, Employee)
     */
    public static function getEloquentQuery(): \Illuminate\Database\Eloquent\Builder
    {
        return parent::getEloquentQuery()->where('role', '!=', 'customer');
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('👥 Thông Tin Tài Khoản Nhân Viên')
                ->description('Quản lý thông tin định danh và gán phòng ban cho nhân sự')
                ->icon('heroicon-o-user-circle')
                ->schema([
                    Grid::make(2)->schema([
                        Forms\Components\TextInput::make('name')
                            ->label('Tên nhân viên')
                            ->placeholder('Ví dụ: Nguyễn Văn A...')
                            ->prefix('👤')
                            ->required(),

                        Forms\Components\TextInput::make('email')
                            ->label('Email làm việc')
                            ->email()
                            ->placeholder('Ví dụ: nva@flashtech.vn...')
                            ->prefix('✉️')
                            ->required()
                            ->unique(ignoreRecord: true),
                    ]),

                    Grid::make(2)->schema([
                        Forms\Components\Select::make('role')
                            ->label('Vai trò / Phân quyền')
                            ->options([
                                'admin' => 'Admin (Quản trị tối cao)',
                                'moderator' => 'Moderator (Kiểm duyệt viên)',
                                'employee' => 'Employee (Nhân viên vận hành)',
                            ])
                            ->default('employee')
                            ->prefix('🛡️')
                            ->required()
                            ->live()
                            ->afterStateUpdated(function (string $state, $set){
                                $prefix = match ($state) {
                                    'admin' => 'AD',
                                    'moderator' => 'MD',
                                    default => 'NV',
                                };
                                $set('employee_code', $prefix . '-' . strtoupper(\Illuminate\Support\Str::random(5)));
                            }),

                        Forms\Components\Select::make('department_id')
                            ->label('Phòng ban công tác')
                            ->relationship('department', 'name')
                            ->searchable()
                            ->preload()
                            ->prefix('🏢')
                            ->required(fn ($get): bool => $get('role') === 'employee'),
                    ]),

                    Grid::make(2)->schema([
                        Forms\Components\TextInput::make('employee_code')
                            ->label('Mã nhân viên (Tự động)')
                            ->prefix('🆔')
                            ->default(fn () => 'NV-' . strtoupper(\Illuminate\Support\Str::random(5)))
                            ->disabled()
                            ->dehydrated()
                            ->unique(ignoreRecord: true),

                        Forms\Components\Toggle::make('is_active')
                            ->label('Kích hoạt trạng thái làm việc')
                            ->default(true),
                    ]),
                ])
                ->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Tên nhân viên')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),

                Tables\Columns\TextColumn::make('email')
                    ->label('Email')
                    ->copyable()
                    ->icon('heroicon-m-envelope')
                    ->searchable(),

                Tables\Columns\TextColumn::make('employee_code')
                    ->label('Mã nhân viên')
                    ->fontFamily('mono')
                    ->copyable()
                    ->searchable(),

                Tables\Columns\TextColumn::make('department.name')
                    ->label('Phòng ban')
                    ->badge()
                    ->color('gray')
                    ->searchable(),

                Tables\Columns\TextColumn::make('role')
                    ->label('Vai trò')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'admin' => 'danger',
                        'moderator' => 'warning',
                        default => 'info',
                    })
                    ->formatStateUsing(fn ($state) => match ($state) {
                        'admin' => 'Quản trị viên',
                        'moderator' => 'Kiểm duyệt viên',
                        default => 'Nhân viên',
                    }),

                Tables\Columns\ToggleColumn::make('is_active')
                    ->label('Trạng thái kích hoạt'),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('role')
                    ->label('Lọc theo vai trò')
                    ->options([
                        'admin' => 'Quản trị viên',
                        'moderator' => 'Kiểm duyệt viên',
                        'employee' => 'Nhân viên',
                    ]),
            ])
            ->recordActions([
                \Filament\Actions\EditAction::make()->label('Sửa'),
                \Filament\Actions\DeleteAction::make()->label('Xóa'),
                \Filament\Actions\Action::make('resetPassword')
                    ->label('Reset MK')
                    ->icon('heroicon-m-arrow-path')
                    ->action(fn(User $record) => $record->resetPassword())
                    ->requiresConfirmation()
                    ->successNotificationTitle('Mật khẩu đã được đặt lại'),
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
