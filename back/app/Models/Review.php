<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'user_id',
        'review',
    ];

    protected $casts = [
        'review' => 'string',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class, "order_id");
    }
}
