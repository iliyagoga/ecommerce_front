<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AddMenuitemInCart;
use App\Http\Requests\AddRoomInCartRequest;
use App\Http\Requests\UpdateRoomInCart;
use App\Models\Cart;
use App\Models\CartMenuItems;
use App\Models\CartRoom;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CartController extends Controller
{
    public function show()
    {
        $user = Auth::user();
        $cart = Cart::with(['cartRooms.room', 'cartMenuItems.menuItem'])->where('user_id', $user->id)->firstOrCreate(['user_id' => $user->id]);

        return response()->json($cart);
    }

    public function addRoom(AddRoomInCartRequest $request)
    {
        $validated = $request->validated();

        $user = Auth::user();
        $cart = Cart::firstOrCreate(['user_id' => $user->id]);

        if ($cart->cartRooms()->count() > 0) {
            return response()->json(['message' => 'В корзине уже есть комната. Удалите ее, чтобы добавить новую.'], 409);
        }

        $room = Room::where('room_id', $request->room_id)->first();
        if (!$room || !$room->is_available) {
            return response()->json(['message' => 'Выбранная комната недоступна.'], 422);
        }

        $cartRoom = $cart->cartRooms()->create($validated);

        return response()->json($cartRoom->load('room'), 201);
    }

    public function updateRoom(UpdateRoomInCart $request, CartRoom $cartRoom)
    {
        $validated = $request->validated();

        $cartRoom->update($validated);

        return response()->json($cartRoom->load('room'));
    }

    public function removeRoom()
    {
        $user = Auth::user();
        $cart = Cart::where('user_id', $user->id)->first();

        if ($cart) {
            $cart->cartRooms()->delete();
            $cart->cartMenuItems()->delete();
        }

        return response()->json(null, 204);
    }

    public function clearCart()
    {
        $user = Auth::user();
        $cart = Cart::where('user_id', $user->id)->first();

        if ($cart) {
            $cart->cartRooms()->delete();
            $cart->cartMenuItems()->delete();
        }

        return response()->json(null, 204);
    }

    public function checkAddMenuItem() {
        $user = Auth::user();
        $hasSpecialRooms = Cart::where('user_id', $user->id)
        ->with(['cartRooms.room' => function($query) {
            $query->where('type', '!=', 'standard');
        }])
        ->get()
        ->contains(function ($cart) {
            return $cart->cartRooms->contains(function ($cartRoom) {
                return $cartRoom->room && $cartRoom->room->type !== 'standard';
            });
        });
        return response()->json($hasSpecialRooms, 201);
    }

    public function addMenuItem(AddMenuitemInCart $request)
    {
        $validated = $request->validated();

        $user = Auth::user();
        $cart = Cart::where('user_id', $user->id)->first();

        $cartMenuItem = $cart->cartMenuItems()->create($validated);

        return response()->json($cartMenuItem, 201);
    }

    public function removeMenuItem(?int $cartMenuItem)
    {
        $menuItem = CartMenuItems::find($cartMenuItem);
        $menuItem->delete();
        return response()->json(null, 204);
    }

    public function updateMenuItem(Request $request, CartMenuItems $cartMenuItem)
    {
        $validator = Validator::make($request->all(), [
            'quantity' => 'required|numeric|min:1|',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $cartMenuItem->update($request->all());

        return response()->json(null, 204);
    }
}
