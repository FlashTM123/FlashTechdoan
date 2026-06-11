<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockImportDetail extends Model
{
    protected $fillable = [
        'stock_import_id',
        'product_variant_id',
        'quantity',
        'unit_price',
        'supplier_sku',
    ];

    public function stockImport(): BelongsTo
    {
        return $this->belongsTo(StockImport::class, 'stock_import_id');
    }

    public function productVariant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }
}
