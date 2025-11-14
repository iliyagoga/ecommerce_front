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
            $table->boolean('is_active')->default(true);
            $table->string('preview_img', 500)->nullable();
            $table->decimal('base_hourly_rate', 10, 2)->default(0)->after('gallery');
            $table->decimal('initial_fee', 10, 2)->default(0)->after('base_hourly_rate');
            $table->integer('max_people')->default(1)->after('initial_fee');
            $table->text('description')->nullable()->after('max_people');
            $table->boolean('is_available')->default(true);
            $table->timestamps();
            
            $table->index(['type', 'is_active']);
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};