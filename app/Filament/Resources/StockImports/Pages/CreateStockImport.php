<?php

namespace App\Filament\Resources\StockImports\Pages;

use App\Filament\Resources\StockImports\StockImportResource;
use Filament\Resources\Pages\CreateRecord;
use Filament\Notifications\Notification;

class CreateStockImport extends CreateRecord
{
    protected static string $resource = StockImportResource::class;

    public function getTitle(): string
    {
        return '📦 Tạo Phiếu Nhập Kho Mới';
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }

    protected function getCreatedNotification(): ?Notification
    {
        return Notification::make()
            ->success()
            ->title('✅ Tạo phiếu thành công!')
            ->body('Phiếu nhập kho mới đã được lưu. Hãy duyệt phiếu khi hàng về kho.');
    }
}
