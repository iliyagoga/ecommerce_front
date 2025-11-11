<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateOrderRoomsTable extends Migration
{
    public function up()
    {
        Schema::table('order_rooms', function (Blueprint $table) {
            $table->dropUnique('unique_room_booking');
        });
    }

    public function down()
    {
        Schema::table('order_rooms', function (Blueprint $table) {
            $table->unique(['room_id', 'booked_date', 'booked_time_start'], 'unique_room_booking');
        });
    }
}