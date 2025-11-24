<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRoomRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'type' => 'required|in:standard,vip,cinema',
            'base_hourly_rate' => 'required|numeric|min:0',
            'initial_fee' => 'required|numeric|min:0',
            'max_people' => 'required|integer|min:1',
            'description' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Поле "Название" обязательно для заполнения',
            'name.string' => 'Поле "Название" должно быть строкой',
            'name.max' => 'Поле "Название" не должно превышать 255 символов',
            
            'type.required' => 'Поле "Тип комнаты" обязательно для заполнения',
            'type.in' => 'Поле "Тип комнаты" должно быть одним из: standard, vip, cinema',
            
            'base_hourly_rate.required' => 'Поле "Базовая почасовая ставка" обязательно для заполнения',
            'base_hourly_rate.numeric' => 'Поле "Базовая почасовая ставка" должно быть числом',
            'base_hourly_rate.min' => 'Поле "Базовая почасовая ставка" должно быть не менее 0',
            
            'initial_fee.required' => 'Поле "Начальный взнос" обязательно для заполнения',
            'initial_fee.numeric' => 'Поле "Начальный взнос" должно быть числом',
            'initial_fee.min' => 'Поле "Начальный взнос" должно быть не менее 0',
            
            'max_people.required' => 'Поле "Максимальное количество человек" обязательно для заполнения',
            'max_people.integer' => 'Поле "Максимальное количество человек" должно быть целым числом',
            'max_people.min' => 'Поле "Максимальное количество человек" должно быть не менее 1',
            
            'description.string' => 'Поле "Описание" должно быть строкой',
            
        ];
    }
}
