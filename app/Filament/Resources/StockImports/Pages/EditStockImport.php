<?php

namespace App\Filament\Resources\StockImports\Pages;

// ĐÃ SỬA: Import đúng đường dẫn file cha nằm trong thư mục StockImports (số nhiều)
use App\Filament\Resources\StockImports\StockImportResource;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Facades\DB;

class EditStockImport extends EditRecord
{
    protected static string $resource = StockImportResource::class;
    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }

    protected function afterSave(): void
    {
        $stockImport = $this->record;

        //  ĐÃ SỬA CHUẨN: Dùng getOriginal() gọi từ Record (Model) để lấy trạng thái cũ trước khi bấm Lưu
        $oldStatus = $this->getRecord()->getOriginal('import_status');

        // Chỉ kích hoạt cộng dồn kho nếu trạng thái thực tế vừa được chuyển từ 'pending' sang 'completed'
        if ($stockImport->import_status === 'completed' && $oldStatus === 'pending') {

            // Dùng DB Transaction bảo vệ dữ liệu toàn vẹn
            DB::transaction(function () use ($stockImport) {

                // Vòng lặp chạy qua từng dòng sản phẩm nhập về để cộng kho
                foreach ($stockImport->details as $detail) {
                    $variant = $detail->productVariant;

                    if ($variant) {
                        // Tự động cộng dồn số lượng vào cột stock của laptop đó
                        $variant->increment('stock', $detail->quantity);
                    }
                }
            });
        }
    }
}
