<?php

namespace App\Filament\Resources\StockImports\Pages;

use App\Filament\Resources\StockImports\StockImportResource;
use Filament\Resources\Pages\EditRecord;
use Filament\Notifications\Notification;
use Illuminate\Support\Facades\DB;

class EditStockImport extends EditRecord
{
    protected static string $resource = StockImportResource::class;

    public function getTitle(): string
    {
        $code = $this->record?->import_code ?? 'Phiếu nhập';
        return "✏️ Chỉnh Sửa: {$code}";
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }

    protected function getSavedNotification(): ?Notification
    {
        $newStatus = $this->data['import_status'] ?? null;
        if ($newStatus === 'completed') {
            return Notification::make()
                ->success()
                ->title('✅ Phếu đã được duyệt!')
                ->body('Tồn kho đã được cập nhật tự động.');
        }
        return Notification::make()
            ->success()
            ->title('💾 Đã lưu phếu nhập kho')
            ->body('Thông tin phiếu đã được cập nhật.');
    }

    // Chặn đầu khi dữ liệu cũ chưa bị ghi đè
    protected function beforeSave(): void
    {
        $stockImport = $this->record;

        // Lấy trạng thái thực tế đang nằm trong Database trước khi bấm Lưu
        $oldStatus = $stockImport->getOriginal('import_status');

        // Lấy trạng thái mới mà người dùng vừa chọn trên Form giao diện
        $newStatus = $this->data['import_status'] ?? null;

        // Kiểm tra: Nếu phiếu thực sự được duyệt từ 'pending' sang 'completed'
        if ($newStatus === 'completed' && $oldStatus === 'pending') {

            // Dùng DB Transaction bảo vệ dữ liệu toàn vẹn
            DB::transaction(function () use ($stockImport) {

                // Vòng lặp chạy qua từng máy trong danh sách nhập hàng
                foreach ($stockImport->details as $detail) {
                    $variant = $detail->productVariant;

                    if ($variant) {
                        // Kích hoạt tăng số lượng tồn kho trực tiếp trong MySQL
                        $variant->increment('stock', $detail->quantity);
                    }
                }
            });
        }
    }
}
