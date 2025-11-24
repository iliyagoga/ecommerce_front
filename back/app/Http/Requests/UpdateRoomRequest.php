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
        return false;
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
}
