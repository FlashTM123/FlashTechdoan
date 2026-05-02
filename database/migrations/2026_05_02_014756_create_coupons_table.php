<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('coupons', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();                          // VD: SALE10, FLASHTECH20
            $table->enum('type', ['fixed', 'percent']);                // Giảm cố định hoặc %
            $table->decimal('value', 12, 2);                          // Giá trị giảm
            $table->unsignedInteger('min_order_amount')->default(0);   // Đơn tối thiểu để áp dụng
            $table->unsignedInteger('usage_limit')->nullable();        // Giới hạn số lần dùng
            $table->unsignedInteger('used_count')->default(0);         // Đã dùng bao nhiêu lần
            $table->boolean('is_active')->default(true);
            $table->dateTime('expires_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('coupons');
    }
};
