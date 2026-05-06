<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payment_methods', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Ví dụ: Chuyển khoản ngân hàng, Ví MoMo, Tiền mặt
            $table->string('code')->unique(); // vnpay, momo, cod
            $table->boolean('status')->default(true); // Hoạt động hoặc Bảo trì
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_methods');
    }
};
