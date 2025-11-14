<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with(['user:id,name,email'])->get()->map(function ($order) {
            $orderArray = $order->toArray();
            $orderArray['client_name'] = $order->user ? $order->user->name : null;
            $orderArray['client_email'] = $order->user ? $order->user->email : null;
            return $orderArray;
        });

        if (Auth::check() && Auth::user()->role === 'admin') {
            return response()->json($orders);
        } elseif (Auth::check()) {
            return response()->json($orders->where("user_id", Auth::id())->values()->all());
        }

        return response()->json(['message' => 'Unauthorized'], 403);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
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
        ]);

        $order = null;
        DB::transaction(function () use ($validatedData, & $order) {
            $validatedData["user_id"] = Auth::id();
            
            $startDateTime = Carbon::parse($validatedData['booked_date'])->setTimeFromTimeString($validatedData['booked_time_start']);
            $endDateTime = Carbon::parse($validatedData['booked_date'])->setTimeFromTimeString($validatedData['booked_time_end']);
            $validatedData['start_time'] = $startDateTime;
            $validatedData['end_time'] = $endDateTime;

            $order = Order::create($validatedData);


            $room = \App\Models\Room::where("room_id", $validatedData['room_id'])->first();
            if (!$room || !$room->is_available) {
                throw new \Exception("Выбранная комната недоступна для бронирования", 422);
            }

            $order->orderRooms()->create([ 
                'order_id' => $order->order_id,
                'room_id' => $validatedData['room_id'],
                'booked_hours' => $validatedData['booked_hours'],
                'booked_date' => $validatedData['booked_date'],
                'booked_time_start' => $validatedData['booked_time_start'],
                'booked_time_end' => $validatedData['booked_time_end'],
                'room_price_per_hour' => $validatedData['room_price_per_hour'],
            ]);

            $user = Auth::user();
            $cart = Cart::where('user_id', $user->id)->first();
    

            if (isset($validatedData['items'])) {
                foreach ($validatedData['items'] as $itemData) {
                    $order->orderItems()->create($itemData);
                }
            }

            if ($cart) {
                $cart->cartRooms()->delete();
                $cart->cartMenuItems()->delete();
            }
        });

        return response()->json($order, Response::HTTP_CREATED);
    }

    public function show(int $id)
    {
        $order = Order::with(["orderRooms.room", "user", "orderItems.menuItem"])->where('order_id', $id)->first();


        if (Auth::check() && Auth::user()->role === 'admin') {

            return response()->json($order);
        } elseif (Auth::check() && $order->user_id === Auth::id()) {
            return response()->json($order);
        }
        
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    public function update(Request $request, int $id)
    {
        $order = Order::where('order_id', $id)->firstOrFail();
        $order->update($request->all());
        return response()->json($order);
    }

    public function destroy(int $id)
    {
        $order = Order::where('order_id', $id)->firstOrFail();
        $order->delete();
        return response()->json(null, Response::HTTP_NO_CONTENT);
    }

    public function updateStatus(Request $request, int $id)
    {
        $validatedData = $request->validate([
            'status' => 'required|in:pending,confirmed,active,completed,cancelled',
        ]);

        $order = Order::where('order_id', $id);
        $order->update($validatedData);

        return response()->json($order);
    }

    public function ordersForUser()
    {
        $orders = Order::with(['user:id,name,email'])->get()->map(function ($order) {
            $orderArray = $order->toArray();
            $orderArray['client_name'] = $order->user ? $order->user->name : null;
            $orderArray['client_email'] = $order->user ? $order->user->email : null;
            return $orderArray;
        });

        if (!Auth::check()) return response()->json(['message' => 'Unauthorized'], 403);

        return response()->json($orders->where("user_id", Auth::id())->values()->all());
    }
}
