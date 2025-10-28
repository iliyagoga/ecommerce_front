<?php
namespace App;
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

    public static function rules(): array
    {
        return [
            'type' => 'required|in:обычная,вип,кино',
            'name' => 'required|string|max:255',
            'base_hourly_rate' => 'required|numeric|min:0',
            'initial_fee' => 'required|numeric|min:0',
            'max_people' => 'required|integer|min:1',
            'description' => 'nullable|string',
            'preview_img' => 'nullable|string',
            'is_available' => 'boolean',
        ];
    }

    public function gallery(): HasMany
    {
        return $this->hasMany(RoomGallery::class, 'room_id');
    }

    public function orderRooms(): HasMany
    {
        return $this->hasMany(OrderRoom::class, 'room_id');
    }

    // Scope для активных комнат
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Scope для доступных для бронирования комнат
    public function scopeAvailable($query)
    {
        return $query->where('is_active', true)
                    ->where('is_blocked', false);
    }

    // Scope по типу комнаты
    public function scopeOfType($query, string $type)
    {
        return $query->where('type', $type);
    }
}