<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartRoom;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CartController extends Controller
{
    public function show()
    {
        $user = Auth::user();
        $cart = Cart::with(['cartRooms.room'])->where('user_id', $user->id)->firstOrCreate(['user_id' => $user->id]);

        return response()->json($cart);
    }

    public function addRoom(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'room_id' => 'required|integer|exists:rooms,room_id',
            'booked_hours' => 'required|integer|min:1|max:24',
            'booked_date' => 'required|date|after_or_equal:today',
            'booked_time_start' => 'required|date_format:H:i',
            'booked_time_end' => 'required|date_format:H:i|after:booked_time_start',
            'room_price_per_hour' => 'required|numeric|min:0|max:99999999.99',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = Auth::user();
        $cart = Cart::firstOrCreate(['user_id' => $user->id]);

        // Проверяем, есть ли уже комната в корзине (пользователь запросил 1 комнату на 1 корзину)
        if ($cart->cartRooms()->count() > 0) {
            return response()->json(['message' => 'В корзине уже есть комната. Удалите ее, чтобы добавить новую.'], 409);
        }

        // Проверяем доступность комнаты
        $room = Room::where('room_id', $request->room_id)->first();
        if (!$room || !$room->is_available) {
            return response()->json(['message' => 'Выбранная комната недоступна.'], 422);
        }

        $cartRoom = $cart->cartRooms()->create($request->all());

        return response()->json($cartRoom->load('room'), 201);
    }

    public function updateRoom(Request $request, CartRoom $cartRoom)
    {
        $validator = Validator::make($request->all(), [
            'booked_hours' => 'integer|min:1|max:24',
            'booked_date' => 'date|after_or_equal:today',
            'booked_time_start' => 'date_format:H:i',
            'booked_time_end' => 'date_format:H:i|after:booked_time_start',
            'room_price_per_hour' => 'numeric|min:0|max:99999999.99',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $cartRoom->update($request->all());

        return response()->json($cartRoom->load('room'));
    }

    public function removeRoom(CartRoom $cartRoom)
    {
        $cartRoom->delete();

        return response()->json(null, 204);
    }

    public function clearCart()
    {
        $user = Auth::user();
        $cart = Cart::where('user_id', $user->id)->first();

        if ($cart) {
            $cart->cartRooms()->delete();
        }

        return response()->json(null, 204);
    }
}
