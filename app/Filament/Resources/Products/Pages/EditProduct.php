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

    protected function afterSave(): void
    {
        $record = $this->record;
        $bulkImages = $this->data['bulk_images'] ?? [];

        if (!empty($bulkImages)) {
            foreach ($bulkImages as $file) {
                $record->images()->create([
                    'image_url' => $file,
                    'is_primary' => false,
                ]);
            }
        }
    }
}
