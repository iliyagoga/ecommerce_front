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
            'date' => 'required|date',
            'start_time' => [
                'required',
                'date_format:H:i',
                function ($attribute, $value, $fail) {
                    $bookedDate = $this->input('booked_date');
                    $bookedDateTime = Carbon::parse($bookedDate . ' ' . $value);
                    
                    if ($bookedDateTime->lt(now())) {
                        $fail('Время начала бронирования должно быть не раньше текущего момента.');
                    }
                },
            ],
            'end_time' => 'required|date_format:H:i|after:start_time',
        ];
    }

    public function messages()
    {
        return [
            'date.required' => 'Укажите дату бронирования.',
            'date.date' => 'Неверный формат даты.',
            
            'start_time.required' => 'Укажите время начала.',
            'start_time.date_format' => 'Неверный формат времени начала.',
            
            'end_time.required' => 'Укажите время окончания.',
            'end_time.date_format' => 'Неверный формат времени окончания.',
            'end_time.after' => 'Время окончания должно быть позже времени начала.',
        ];
    }
}
