<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RoomGallery extends Model
{
    use HasFactory;

    protected $fillable = [
        'room_id',
        'url'
    ];

    protected $table = 'room_galleries';

    protected $primaryKey = 'img_id';

    public static function rules(): array
    {
        return [
            'room_id' => 'required|integer|exists:rooms,room_id',
            'url' => 'required|string|url|max:500'
        ];
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class, 'room_id');
    }
}