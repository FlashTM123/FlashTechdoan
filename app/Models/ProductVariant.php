<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    protected $fillable = [
        'product_id', 
        'variant_name', 
        'color', 
        'price', 
        'old_price', 
        'stock', 
        'sku',
        'specifications' // Thêm specifications
    ];

    // Ép kiểu mảng JSON
    protected $casts = [
        'specifications' => 'array',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
