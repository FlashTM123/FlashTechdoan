<?php

namespace App\Filament\Resources\Products\Pages;

use App\Filament\Resources\Products\ProductResource;
use Filament\Resources\Pages\CreateRecord;
use Override;

class CreateProduct extends CreateRecord
{
    protected static string $resource = ProductResource::class;

    #[Override]
    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }

    protected function afterCreate(): void
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
