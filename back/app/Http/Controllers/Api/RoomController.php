<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Room; // Убедитесь, что модель Room существует
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class RoomController extends Controller
{
    public function index()
    {
        return response()->json(Room::all());
    }

    public function store(Request $request)
    {
        $room = Room::create($request->all());
        return response()->json($room, Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $room = Room::where('room_id', $id)->firstOrFail();
        return response()->json($room);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id)
    {
        $room = Room::where('room_id', $id)->firstOrFail();
        $room->update($request->all());
        return response()->json($room);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $room = Room::where('room_id', $id)->firstOrFail();
        $room->delete();
        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
