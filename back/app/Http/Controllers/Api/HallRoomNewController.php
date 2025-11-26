<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RoomAvailability;
use App\Http\Requests\StoreRoomInHall;
use App\Models\HallNew;
use App\Models\HallRoomNew;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class HallRoomNewController extends Controller
{
    public function index(HallNew $hallNew)
    {
        return response()->json($hallNew->hallRoomsNew);
    }

    public function store(StoreRoomInHall $request, HallNew $hallNew)
    {
        $validated = $request->validated();

        $room = $hallNew->hallRoomsNew()->create($validated);
        return response()->json($room, 201);
    }

    public function show(HallNew $hallNew, HallRoomNew $hallRoomNew)
    {
        return response()->json($hallRoomNew);
    }

    public function update(StoreRoomInHall $request, HallNew $hallNew, HallRoomNew $hallRoomNew)
    {
        $validated = $request->validated();

        $hallRoomNew->update($validated);
        return response()->json($hallRoomNew);
    }

    public function destroy(HallNew $hallNew, HallRoomNew $hallRoomNew)
    {
        $hallRoomNew->delete();
        return response()->json(null, 204);
    }

    public function getHallRoomsAvailability(RoomAvailability $request, HallNew $hallNew)
    {
        $validated = $request->validated();

        $requestedStartTime = Carbon::parse($validated['booked_time_start'])->addUTCHours(4);
        $requestedEndTime = Carbon::parse($validated['booked_time_end'])->addUTCHours(4);
        $hallRooms = $hallNew->hallRoomsNew()->with('room')->get();

        $hallRoomsWithAvailability = $hallRooms->map(function ($hallRoom) use ($requestedStartTime, $requestedEndTime) {
            $isBooked = false;
            if ($hallRoom->room && $hallRoom->room->is_available) {

                $bookedOrdersCount = \App\Models\OrderRooms::where('room_id', $hallRoom->room->room_id)
                    ->where(function ($query) use ($requestedStartTime, $requestedEndTime) {
                    $query->whereRaw('booked_time_start < ?', [$requestedEndTime])
                    ->whereRaw('? < booked_time_end', [$requestedStartTime]);
                    })
                    ->join('orders', 'orders.order_id', '=', 'order_rooms.order_id')->whereNot("orders.status", "cancelled")
                    ->count();

                if ($bookedOrdersCount > 0) {
                    $isBooked = true;
                }
            } else {
                $isBooked = true;
            }

            $hallRoom->is_available_for_booking = !$isBooked;
            return $hallRoom;
        });

        return response()->json($hallRoomsWithAvailability);
    }
}
