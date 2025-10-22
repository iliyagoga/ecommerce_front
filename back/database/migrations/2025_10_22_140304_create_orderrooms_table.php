<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_rooms', function (Blueprint $table) {
            $table->id('order_room_id');
            $table->foreignId('order_id')->constrained('orders', 'order_id')->onDelete('cascade');
            $table->foreignId('room_id')->constrained('rooms', 'room_id')->onDelete('cascade');
            $table->integer('booked_hours');
            $table->date('booked_date');
            $table->time('booked_time_start');
            $table->time('booked_time_end');
            $table->decimal('room_price_per_hour', 10, 2);
            $table->timestamps();
            
            // Индексы
            $table->index('order_id');
            $table->index('room_id');
            $table->index('booked_date');
            $table->index(['booked_date', 'booked_time_start']);
            
            // Уникальный индекс чтобы избежать дублирования броней
            $table->unique(['room_id', 'booked_date', 'booked_time_start'], 'unique_room_booking');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_rooms');
    }
};