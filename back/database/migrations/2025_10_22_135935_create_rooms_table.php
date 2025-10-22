<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->id('room_id');
            $table->enum('type', ['standard', 'vip', 'cinema'])->default('standard');
            $table->string('name', 50);
            $table->boolean('is_blocked')->default(false);
            $table->boolean('is_active')->default(true);
            $table->string('preview_img', 500)->nullable();
            $table->timestamps();
            
            // Индексы
            $table->index(['type', 'is_active']);
            $table->index('is_blocked');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};