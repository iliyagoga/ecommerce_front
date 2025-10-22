<?php

namespace App;

enum RoomType: string
{
    case STANDARD = 'standard';
    case VIP = 'vip';
    case CINEMA = 'cinema';

    public function label(): string
    {
        return match($this) {
            self::STANDARD => 'Обычная',
            self::VIP => 'VIP',
            self::CINEMA => 'Кинотеатр',
        };
    }

    public function color(): string
    {
        return match($this) {
            self::STANDARD => 'blue',
            self::VIP => 'gold',
            self::CINEMA => 'purple',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public static function labels(): array
    {
        return [
            self::STANDARD->value => self::STANDARD->label(),
            self::VIP->value => self::VIP->label(),
            self::CINEMA->value => self::CINEMA->label(),
        ];
    }
}