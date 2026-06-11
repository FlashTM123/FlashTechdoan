<?php

namespace App\Filament\Resources\StockImports\Pages;

use App\Filament\Resources\StockImports\StockImportResource;
use Filament\Resources\Pages\CreateRecord;

class CreateStockImport extends CreateRecord
{
    protected static string $resource = StockImportResource::class;
    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
