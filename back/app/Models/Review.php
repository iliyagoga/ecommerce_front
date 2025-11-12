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

    public static function rules(): array
    {
        return [
            'order_id' => 'required|integer|exists:orders,order_id',
            'user_id' => 'required|integer|exists:users,id',
            'review' => 'required|string',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class, "order_id");
    }
}
