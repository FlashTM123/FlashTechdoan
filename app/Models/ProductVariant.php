<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    protected $fillable = [
        'product_id',
        'variant_name', 
        'price',
        'old_price',
        'stock',
        'sku',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function details()
    {
        return $this->hasMany(ProductVariantDetail::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class, 'product_variant_id');
    }
}
