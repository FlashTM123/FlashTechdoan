<?php

namespace App\Filament\Resources\StockImports\Pages;

use App\Filament\Resources\StockImports\StockImportResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListStockImports extends ListRecords
{
    protected static string $resource = StockImportResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
