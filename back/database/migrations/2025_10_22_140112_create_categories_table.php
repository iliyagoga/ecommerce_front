<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id('category_id');
            $table->string('name', 100);
            $table->timestamps();
            
            // Индексы
            $table->index('type');
            $table->index('name');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};