<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
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
            'status' => ['required', 'string', 'in:pending,confirmed,active,completed,cancelled'],
            'total_price' => ['required', 'numeric', 'min:0', 'max:99999999.99'],
            'client_comment' => ['nullable', 'string', 'max:1000'],

            'room_id' => ['required', 'integer', 'exists:rooms,room_id'],
            'booked_hours' => ['required', 'integer', 'min:1', 'max:24'],
            'booked_date' => ['required', 'date', 'after_or_equal:today'],
            'booked_time_start' => ['required', 'date_format:H:i'],
            'booked_time_end' => ['required', 'date_format:H:i', 'after:booked_time_start'],
            'room_price_per_hour' => ['required', 'numeric', 'min:0', 'max:99999999.99'],

            'items' => ['array'],
            'items.*.item_id' => ['required', 'integer', 'exists:menu_items,item_id'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:1000'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0', 'max:99999999.99'],
            'items.*.total_price' => ['required', 'numeric', 'min:0', 'max:99999999.99'],
        ];
    }
}
