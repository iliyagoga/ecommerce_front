<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HallRoomNew extends Model
{
    use HasFactory;

    protected $table = 'hall_rooms_new';

    protected $fillable = [
        'hall_id',
        'name',
        'x',
        'y',
        'width',
        'height',
        'color',
        'metadata',
        'room_id',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function hallNew(): BelongsTo
    {
        return $this->belongsTo(HallNew::class, 'hall_id');
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Room::class, 'room_id', 'room_id');
    }
}
