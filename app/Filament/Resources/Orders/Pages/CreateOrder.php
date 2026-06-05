<?php

namespace App\Filament\Resources\Orders\Pages;

use App\Filament\Resources\Orders\OrderResource;
use Filament\Resources\Pages\CreateRecord;

class CreateOrder extends CreateRecord
{
    protected static string $resource = OrderResource::class;

    public function getMaxContentWidth(): \Filament\Support\Enums\Width
    {
        return \Filament\Support\Enums\Width::SevenExtraLarge;
    }

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $data['processed_by_id'] = auth()->id();
        return $data;
    }

    protected function afterCreate(): void
    {
        $order = $this->record;
        $order->load('items');

        $total = 0;
        foreach ($order->items as $item) {
            $total += $item->quantity * $item->unit_price;

            if ($item->product_variants_id) {
                $variant = \App\Models\ProductVariant::find($item->product_variants_id);
                if ($variant) {
                    $variant->decrement('stock', $item->quantity);
                }
            }
        }

        $order->update(['total_amount' => $total]);
    }
}
