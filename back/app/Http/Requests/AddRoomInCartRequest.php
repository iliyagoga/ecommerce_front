<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AddRoomInCartRequest extends FormRequest
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
            'room_id' => 'required|integer|exists:rooms,room_id',
            'booked_hours' => 'required|integer|min:0|max:24',
            'booked_date' => 'required|date|after_or_equal:today',
            'booked_time_start' => 'required|date_format:H:i',
            'booked_time_end' => 'required|date_format:H:i|after:booked_time_start',
            'room_price_per_hour' => 'required|numeric|min:0|max:99999999.99',
        ];
    }

    public function messages()
{
    return [
        'room_id.exists' => 'Выбранная комната не существует.',
        
        'booked_hours.required' => 'Укажите количество часов бронирования.',
        'booked_hours.integer' => 'Количество часов должно быть целым числом.',
        'booked_hours.max' => 'Максимальное время бронирования - 24 часа.',
        
        'booked_date.required' => 'Укажите дату бронирования.',
        'booked_date.date' => 'Неверный формат даты.',
        'booked_date.after_or_equal' => 'Дата бронирования не может быть в прошлом.',
        
        'booked_time_start.required' => 'Укажите время начала бронирования.',
        'booked_time_start.date_format' => 'Неверный формат времени начала.',
        
        'booked_time_end.required' => 'Укажите время окончания бронирования.',
        'booked_time_end.date_format' => 'Неверный формат времени окончания.',
        'booked_time_end.after' => 'Время окончания должно быть позже времени начала.',
    ];
}
}
