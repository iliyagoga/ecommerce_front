<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Room extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'name',
        'is_active',
        'preview_img',
        'base_hourly_rate',
        'initial_fee',
        'max_people',
        'description',
        'is_available',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_available' => 'boolean',
        'base_hourly_rate' => 'float',
        'initial_fee' => 'float',
        'max_people' => 'integer',
    ];

    public function gallery(): HasMany
    {
        return $this->hasMany(RoomGallery::class, 'room_id');
    }

    public function orderRooms(): HasMany
    {
        return $this->hasMany(OrderRooms::class, 'room_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }


    public function scopeAvailable($query)
    {
        return $query->where('is_active', true)
                    ->where('is_blocked', false);
    }

    public function scopeOfType($query, string $type)
    {
        return $query->where('type', $type);
    }

    public function cartRooms(): HasMany
    {
        return $this->hasMany(CartRoom::class, 'room_id');
    }
}