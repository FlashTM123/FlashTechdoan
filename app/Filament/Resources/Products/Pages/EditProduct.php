<?php

namespace App\Filament\Resources\Products\Pages;

use App\Filament\Resources\Products\ProductResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditProduct extends EditRecord
{
    protected static string $resource = ProductResource::class;

    #[Override]
    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }

    protected function getSaveFormAction(): \Filament\Actions\Action
    {
        return parent::getSaveFormAction()
            ->disabled(fn () => empty($this->data['variants']));
    }

    protected function afterSave(): void
    {
        $record = $this->record;
        $bulkImages = $this->data['bulk_images'] ?? [];

        // 1. Lấy danh sách ảnh hiện tại trong DB (loại trừ ảnh của biến thể)
        $existingImages = $record->images()->whereNull('product_variant_id')->get();
        $existingUrls = $existingImages->pluck('image_url')->toArray();

        // 2. Xóa các ảnh trong DB mà không có trong danh sách tải lên mới (bulkImages)
        foreach ($existingImages as $dbImage) {
            if (!in_array($dbImage->image_url, $bulkImages)) {
                $dbImage->delete();
            }
        }

        // 3. Thêm các ảnh mới được tải lên
        foreach ($bulkImages as $file) {
            if (!in_array($file, $existingUrls)) {
                $record->images()->create([
                    'image_url' => $file,
                    'is_primary' => false,
                ]);
            }
        }
    }
}
