<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Carbon\Carbon;

class RoomAvailability extends FormRequest
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
            'booked_time_start' => 'required|date_format:Y-m-d\TH:i|after_or_equal:today',
            'booked_time_end' => 'required|date_format:Y-m-d\TH:i|after:booked_time_start',
        ];
    }

    public function messages()
    {
        return [
        'booked_time_start.required' => 'Укажите время начала бронирования.',
        'booked_time_start.date_format' => 'Неверный формат времени начала.',
        'booked_time_start.after_or_equal' => 'Дата бронирования не может быть в прошлом.',
        
        'booked_time_end.required' => 'Укажите время окончания бронирования.',
        'booked_time_end.date_format' => 'Неверный формат времени окончания.',
        'booked_time_end.after' => 'Время окончания должно быть позже времени начала.',
        ];
    }
}
