<?php

namespace App\Filament\Resources\Orders\Pages;

use App\Filament\Resources\Orders\OrderResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListOrders extends ListRecords
{
    protected static string $resource = OrderResource::class;

    protected function getHeaderActions(): array
    {
        return [
            \Filament\Actions\CreateAction::make()
                ->label('Tạo đơn hàng')
                ->mutateFormDataUsing(function (array $data): array {
                    $data['processed_by_id'] = auth()->id();
                    return $data;
                })
                ->after(function (\App\Models\Order $record) {
                    $record->load('items');

                    $total = 0;
                    foreach ($record->items as $item) {
                        $total += $item->quantity * $item->unit_price;

                        if ($item->product_variants_id) {
                            $variant = \App\Models\ProductVariant::find($item->product_variants_id);
                            if ($variant) {
                                $variant->decrement('stock', $item->quantity);
                            }
                        }
                    }

                    $record->update(['total_amount' => $total]);
                }),
        ];
    }
}
