<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\ProductVariant;

class ProductImage extends Model
{
    protected $fillable = [
        'product_id',
        'product_variant_id',
        'image_url',
        'display_order',
        'is_primary',
    ];

    /**
     * Tự động fill product_id từ product_variant khi lưu ảnh qua quan hệ variant.
     * Trường hợp: Filament Repeater lưu ảnh qua relationship product_variant → images,
     * chỉ set product_variant_id, không set product_id.
     */
    protected static function boot(): void
    {
        parent::boot();

        static::saving(function (ProductImage $image) {
            if (empty($image->product_id) && !empty($image->product_variant_id)) {
                $variant = ProductVariant::find($image->product_variant_id);
                if ($variant) {
                    $image->product_id = $variant->product_id;
                }
            }
        });
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function variant()
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }
}
