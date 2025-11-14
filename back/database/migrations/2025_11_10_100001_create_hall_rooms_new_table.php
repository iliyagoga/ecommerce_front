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
        Schema::create('hall_rooms_new', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hall_id')->constrained('halls_new')->onDelete('cascade');
            $table->string('name');
            $table->integer('x');
            $table->integer('y');
            $table->integer('width');
            $table->integer('height');
            $table->string('color')->default('#e0e0ff');
            $table->json('metadata')->nullable();
            $table->foreignId('room_id')->nullable()->constrained('rooms', 'room_id')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hall_rooms_new');
    }
};
