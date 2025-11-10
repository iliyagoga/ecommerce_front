<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HallRoomNew extends Model
{
    use HasFactory;

    protected $table = 'hall_rooms_new'; // Specify the table name

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

    /**
     * Get the hallNew that owns the HallRoomNew.
     */
    public function hallNew(): BelongsTo
    {
        return $this->belongsTo(HallNew::class, 'hall_id');
    }
}
