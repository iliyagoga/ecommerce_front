<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class HallNew extends Model
{
    use HasFactory;

    protected $table = 'halls_new'; // Specify the table name

    protected $fillable = [
        'name',
        'width',
        'height',
        'svg_background',
    ];

    /**
     * Get the hall_rooms_new for the HallNew.
     */
    public function hallRoomsNew(): HasMany
    {
        return $this->hasMany(HallRoomNew::class, 'hall_id');
    }
}
