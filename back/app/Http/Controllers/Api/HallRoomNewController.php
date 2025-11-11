<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HallNew;
use App\Models\HallRoomNew;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon; // Import Carbon

class HallRoomNewController extends Controller
{
    /**
     * Display a listing of the resource for a specific hall.
     */
    public function index(HallNew $hallNew)
    {
        return response()->json($hallNew->hallRoomsNew);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, HallNew $hallNew)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'x' => 'required|integer',
            'y' => 'required|integer',
            'width' => 'required|integer',
            'height' => 'required|integer',
            'color' => 'required|string|max:7',
            'metadata' => 'nullable|json',
            'room_id' => 'nullable|exists:rooms,room_id', // Add validation for room_id
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $room = $hallNew->hallRoomsNew()->create($request->all());
        return response()->json($room, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(HallNew $hallNew, HallRoomNew $hallRoomNew)
    {
        return response()->json($hallRoomNew);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, HallNew $hallNew, HallRoomNew $hallRoomNew)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'x' => 'integer',
            'y' => 'integer',
            'width' => 'integer',
            'height' => 'integer',
            'color' => 'string|max:7',
            'metadata' => 'nullable|json',
            'room_id' => 'nullable|exists:rooms,room_id', // Add validation for room_id
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $hallRoomNew->update($request->all());
        return response()->json($hallRoomNew);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(HallNew $hallNew, HallRoomNew $hallRoomNew)
    {
        $hallRoomNew->delete();
        return response()->json(null, 204);
    }

    /**
     * Get hall rooms with availability for a specific period.
     */
    public function getHallRoomsAvailability(Request $request, HallNew $hallNew)
    {
        $validatedData = $request->validate([
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);

        $requestedDate = Carbon::parse($validatedData['date'])->toDateString();
        $requestedStartTime = $validatedData['start_time'];
        $requestedEndTime = $validatedData['end_time'];

        $hallRooms = $hallNew->hallRoomsNew()->with('room')->get(); // Исправлено на with('room')

        $hallRoomsWithAvailability = $hallRooms->map(function ($hallRoom) use ($requestedDate, $requestedStartTime, $requestedEndTime) {
            $isBooked = false;
            if ($hallRoom->room && $hallRoom->room->is_available) {

                $bookedOrdersCount = \App\Models\OrderRooms::where('room_id', $hallRoom->room->room_id)
                    ->join('orders', 'orders.order_id', '=', 'order_rooms.order_id')->whereNot("orders.status", "cancelled")
                    ->whereDate('orders.start_time', $requestedDate)
                    ->where(function ($query) use ($requestedStartTime, $requestedEndTime) {
                        $query->whereRaw('TIME(orders.start_time) < ?', [$requestedEndTime])
                              ->whereRaw('? < TIME(orders.end_time)', [$requestedStartTime]);
                    })
                    ->count();

                if ($bookedOrdersCount > 0) {
                    $isBooked = true;
                }
            } else {
                $isBooked = true; // Комната недоступна в принципе
            }

            $hallRoom->is_available_for_booking = !$isBooked;
            return $hallRoom;
        });

        return response()->json($hallRoomsWithAvailability);
    }
}
