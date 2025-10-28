<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
class OrderController extends Controller
{
    public function index()
    {
        if (Auth::check() && Auth::user()->role === 'admin') {
            return response()->json(Order::all());
        } elseif (Auth::check()) {
            return response()->json(Order::where('user_id', Auth::id())->get());
        }

        return response()->json(['message' => 'Unauthorized'], 403); // Или пустой массив, в зависимости от желаемого поведения
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'sometimes|exists:users,id', // Опционально, но полезно для валидации, если передается
            'status' => 'required|string|in:pending,confirmed,active,completed,cancelled',
            // Добавьте здесь валидацию для других полей заказа, если необходимо
        ]);

        $data = $request->all();
        $data['user_id'] = Auth::id(); // Привязываем заказ к текущему аутентифицированному пользователю

        $order = Order::create($data);
        return response()->json($order, Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $order = Order::where('order_id', $id)->firstOrFail();

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
        $request->validate([
            'status' => 'required|in:pending,confirmed,active,completed,cancelled',
        ]);

        $order = Order::where('order_id', $id)->firstOrFail();
        $order->status = $request->input('status');
        $order->save();

        return response()->json($order);
    }
}
