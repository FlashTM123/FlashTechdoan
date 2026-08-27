<?php

namespace App\Filament\Resources\Coupons\Pages;

use App\Filament\Resources\Coupons\CouponResource;
use Filament\Resources\Pages\EditRecord;
use Override;

class EditCoupon extends EditRecord
{
    protected static string $resource = CouponResource::class;

    #[Override]
    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
