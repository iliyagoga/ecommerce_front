<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderRooms extends Model
{
    use HasFactory;

    protected $table = 'order_rooms';
    
    protected $primaryKey = "order_room_id";

    protected $fillable = [
        'order_id',
        'room_id',
        'booked_hours',
        'booked_date',
        'booked_time_start',
        'booked_time_end',
        'room_price_per_hour'
    ];

    protected $casts = [
        'booked_date' => 'date',
        'booked_time_start' => 'datetime',
        'booked_time_end' => 'datetime',
        'room_price_per_hour' => 'decimal:2',
        'booked_hours' => 'integer'
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class, "order_id");
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class, 'room_id', 'room_id');
    }
}