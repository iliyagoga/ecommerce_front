<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Order extends Model
{
    use HasFactory;
    protected $table = "orders";
    protected $primaryKey = "order_id";
    
    protected $fillable = [
        'user_id',
        'status',
        'total_price',
        'client_comment',
        'admin_comment',
    ];

    protected $casts = [
        'total_price' => 'decimal:2',
        'created_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function orderRooms(): HasMany
    {
        return $this->hasMany(OrderRooms::class, "order_id");
    }

    public function rooms(): HasManyThrough
    {
        return $this->hasManyThrough(
            Room::class,
            OrderRooms::class,
            'order_id',
            'room_id',
            'order_id',
            'room_id'
        );
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class, "order_id");
    }

    public function review(): HasMany
    {
        return $this->hasMany(Review::class);
    }
}