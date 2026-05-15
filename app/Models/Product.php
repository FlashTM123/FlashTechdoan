<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = ['category_id', 'brand_id', 'name', 'slug', 'thumbnail_url', 'description', 'is_featured', 'is_active'];

    protected $appends = ['average_rating', 'reviews_count'];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }
    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Lấy số sao trung bình của sản phẩm.
     */
    public function getAverageRatingAttribute()
    {
        return round($this->reviews()->where('status', 'approved')->avg('rating') ?: 0, 1);
    }

    /**
     * Lấy tổng số lượng đánh giá.
     */
    public function getReviewsCountAttribute()
    {
        return $this->reviews()->where('status', 'approved')->count();
    }
}
