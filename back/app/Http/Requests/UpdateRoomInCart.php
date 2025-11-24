<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRoomInCart extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'booked_hours' => 'integer|min:1|max:24',
            'booked_date' => 'date|after_or_equal:today',
            'booked_time_start' => 'date_format:H:i',
            'booked_time_end' => 'date_format:H:i|after:booked_time_start',
            'room_price_per_hour' => 'numeric|min:0|max:99999999.99',
        ];
    }
}
