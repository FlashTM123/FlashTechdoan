<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StockImport extends Model
{
    protected $fillable =[
        'import_code',
        'admin_id',
        'supplier_id',
        'import_date',
        'import_status',
        'notes'
    ];

    public function details(): HasMany
    {
        return $this->hasMany(StockImportDetail::class, 'stock_import_id');
    }
    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class, 'supplier_id');
    }
    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admin_id');
    }
}
