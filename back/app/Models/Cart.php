<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Cart extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function cartRooms(): HasMany
    {
        return $this->hasMany(CartRoom::class);
    }

    public function cartMenuItems(): HasMany
    {
        return $this->hasMany(CartMenuItems::class);
    }

    public function rooms(): HasManyThrough
    {
        return $this->hasManyThrough(
            Room::class,
            CartRoom::class,
            'cart_id',
            'room_id',
            'cart_id',
            'room_id'
        );
    }
}
