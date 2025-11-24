<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AddMenuitemInCart extends FormRequest
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
            'item_id' => 'required|integer|exists:rooms,room_id',
            'quantity' => 'required|numeric|min:1|',
            'unit_price' => 'required|decimal:2|min:0|max:99999999.99',
            'total_price' => 'required|decimal:2|min:0|max:99999999.99',
        ];
    }
}
