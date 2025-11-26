<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CartRoom extends Model
{
    use HasFactory;

    protected $fillable = [
        'cart_id',
        'room_id',
        'booked_hours',
        'booked_time_start',
        'booked_time_end',
        'room_price_per_hour',
    ];

    protected $casts = [
        'booked_time_start' => 'datetime',
        'booked_time_end' => 'datetime',
        'room_price_per_hour' => 'decimal:2',
        'booked_hours' => 'integer',
    ];

    public function cart(): BelongsTo
    {
        return $this->belongsTo(Cart::class);
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class, 'room_id', 'room_id');
    }
}
