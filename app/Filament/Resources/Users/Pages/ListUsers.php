<?php

namespace App\Filament\Resources\Users\Pages;

use App\Filament\Resources\Users\UserResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class ListUsers extends ListRecords
{
    protected static string $resource = UserResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make()
                ->label('Thêm nhân viên')
                ->icon('heroicon-o-user-plus')
                ->mutateDataUsing(function (array $data): array {
                    $data['password'] = Hash::make('123456'); // Mật khẩu mặc định 123456
                    return $data;
                }),
        ];
    }
}
