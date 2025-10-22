<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'item_id',
        'quantity',
        'unit_price',
        'total_price'
    ];

    protected $casts = [
        'quantity' => 'integer',
        'unit_price' => 'decimal:2',
        'total_price' => 'decimal:2'
    ];

    public static function rules(): array
    {
        return [
            'order_id' => 'required|integer|exists:orders,order_id',
            'item_id' => 'required|integer|exists:menu_items,item_id',
            'quantity' => 'required|integer|min:1|max:1000',
            'unit_price' => 'required|numeric|min:0|max:99999999.99',
            'total_price' => 'required|numeric|min:0|max:99999999.99'
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class, 'order_id');
    }

    public function menuItem(): BelongsTo
    {
        return $this->belongsTo(MenuItem::class, 'item_id');
    }
}