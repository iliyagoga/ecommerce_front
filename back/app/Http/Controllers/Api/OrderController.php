<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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
            return response()->json($orders);
        }

        return response()->json(['message' => 'Unauthorized'], 403); // Или пустой массив, в зависимости от желаемого поведения
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'status' => ['required', 'string', 'in:pending,confirmed,active,completed,cancelled'],
            'total_price' => ['required', 'numeric', 'min:0', 'max:99999999.99'],
            'client_comment' => ['nullable', 'string', 'max:1000'],
            'admin_comment' => ['nullable', 'string', 'max:1000'],
            'start_time' => ['required', 'date', 'after_or_equal:now'],
            'end_time' => ['required', 'date', 'after:start_time'],

            'rooms' => ['array'],
            'rooms.*.room_id' => ['required', 'integer', 'exists:rooms,room_id'],
            'rooms.*.booked_hours' => ['required', 'integer', 'min:1', 'max:24'],
            'rooms.*.booked_date' => ['required', 'date', 'after_or_equal:today'],
            'rooms.*.booked_time_start' => ['required', 'date_format:H:i'],
            'rooms.*.booked_time_end' => ['required', 'date_format:H:i', 'after:rooms.*.booked_time_start'],
            'rooms.*.room_price_per_hour' => ['required', 'numeric', 'min:0', 'max:99999999.99'],

            'items' => ['array'],
            'items.*.item_id' => ['required', 'integer', 'exists:menu_items,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:1000'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0', 'max:99999999.99'],
            'items.*.total_price' => ['required', 'numeric', 'min:0', 'max:99999999.99'],
        ]);

        $order = null;
        DB::transaction(function () use ($validatedData, & $order) {
            $order = Order::create($validatedData);

            if (isset($validatedData['rooms'])) {
                foreach ($validatedData['rooms'] as $roomData) {
                    $order->orderRooms()->create($roomData);
                }
            }

            if (isset($validatedData['items'])) {
                foreach ($validatedData['items'] as $itemData) {
                    $order->orderItems()->create($itemData);
                }
            }
        });

        return response()->json($order, Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $order = Order::with(['order_rooms'])->where('order_id', $id);

        if (Auth::check() && Auth::user()->role === 'admin') {
            return response()->json($order);
        } elseif (Auth::check() && $order->user_id === Auth::id()) {
            return response()->json($order);
        }

        return response()->json(['message' => 'Unauthorized'], 403);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id)
    {
        $order = Order::where('order_id', $id)->firstOrFail();
        $order->update($request->all());
        return response()->json($order);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $order = Order::where('order_id', $id)->firstOrFail();
        $order->delete();
        return response()->json(null, Response::HTTP_NO_CONTENT);
    }

    /**
     * Update the status of the specified order.
     */
    public function updateStatus(Request $request, int $id)
    {
        $validatedData = $request->validate([
            'status' => 'required|in:pending,confirmed,active,completed,cancelled',
        ]);

        $order = Order::where('order_id', $id);
        $order->update($validatedData);

        return response()->json($order);
    }
}
