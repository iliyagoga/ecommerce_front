<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderStatusRequest;
use App\Models\Order;
use App\Models\Cart;
use App\Models\OrderRooms;
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

    public function store(StoreOrderRequest $request)
    {
        $validatedData = $request->validated();

        $order = null;
        DB::transaction(function () use ($validatedData, & $order) {
            $validatedData["user_id"] = Auth::id();

            $startDateTime = Carbon::parse($validatedData['booked_date'])->setTimeFromTimeString($validatedData['booked_time_start']);
            $endDateTime = Carbon::parse($validatedData['booked_date'])->setTimeFromTimeString($validatedData['booked_time_end']);
            $validatedData['start_time'] = $startDateTime;
            $validatedData['end_time'] = $endDateTime;


            $room = \App\Models\Room::where("room_id", $validatedData['room_id'])->first();

            $preparedStartTime = $validatedData['booked_time_start'];
            $preparedEndTime = $validatedData['booked_time_end'];

            $bookedOrdersCount = \App\Models\OrderRooms::where('room_id', $validatedData['room_id'])
            ->join('orders', 'orders.order_id', '=', 'order_rooms.order_id')->whereNot("orders.status", "cancelled")
            ->whereDate('orders.start_time', $startDateTime)
            ->where(function ($query) use ($preparedStartTime, $preparedEndTime) {
                $query->whereRaw('TIME(orders.start_time) < ?', [$preparedEndTime])
              ->whereRaw('? < TIME(orders.end_time)', [$preparedStartTime]);
            })
            ->count();

            if ($bookedOrdersCount > 0) throw new \Exception("Такая комната уже забронирована", 422);
            if (!$room || !$room->is_available) {
                throw new \Exception("Выбранная комната недоступна для бронирования", 422);
            }
            if (!$room || $room->initial_fee > $validatedData['total_price']) {
                throw new \Exception("Сумма меньше минимального взноса", 422);
            }

            $order = Order::create($validatedData);


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

    public function updateStatus(UpdateOrderStatusRequest $request, int $id)
    {
        $validatedData = $request->validated();

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
