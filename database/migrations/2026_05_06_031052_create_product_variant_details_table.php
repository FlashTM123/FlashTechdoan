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
        Schema::create('product_variant_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_variant_id')->constrained()->onDelete('cascade');
            $table->string('attribute_name');  // Ví dụ: RAM, CPU, SSD
            $table->string('attribute_value'); // Ví dụ: 16GB, i7-12700H, 512GB
            $table->timestamps();
        });

        Schema::table('product_variants', function (Blueprint $table) {
            $table->dropColumn('specifications');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_variants', function (Blueprint $table) {
            $table->json('specifications')->nullable();
        });
        Schema::dropIfExists('product_variant_details');
    }
};
