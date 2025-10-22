<?php
namespace App;
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\RoomType;
class Room extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'name',
        'is_blocked',
        'is_active',
        'preview_img'
    ];

    protected $casts = [
        'is_blocked' => 'boolean',
        'is_active' => 'boolean',
        'type' => RoomType::class
    ];

    public static function rules(): array
    {
        return [
            'type' => 'required|in:standard,vip,cinema',
            'name' => 'required|string|max:50',
            'is_blocked' => 'boolean',
            'is_active' => 'boolean',
            'preview_img' => 'nullable|string|max:500'
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