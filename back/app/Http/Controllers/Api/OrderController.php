<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class OrderController extends Controller
{
    public function index()
    {
        return response()->json(Order::all());
    }

    public function store(Request $request)
    {
        $order = Order::create($request->all());
        return response()->json($order, Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $order = Order::where('order_id', $id)->firstOrFail();
        return response()->json($order);
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
