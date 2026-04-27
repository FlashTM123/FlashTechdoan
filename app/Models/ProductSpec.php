<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use MongoDB\Laravel\Eloquent\Model as MongoModel;

class ProductSpec extends MongoModel
{
    protected $connection = 'mongodb';
    protected $collection = 'product_specs';
    protected $fillable = ['product_id', 'specification'];
}
