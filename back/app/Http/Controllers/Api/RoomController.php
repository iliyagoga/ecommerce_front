<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRoomRequest;
use App\Http\Requests\UpdateRoomRequest;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class RoomController extends Controller
{
    public function index()
    {
        return response()->json(Room::all());
    }

    public function store(StoreRoomRequest $request)
    {  
        $validatedData = $request->validated();

        if ($request->hasFile('preview_img')) {
            $previewImagePath = $request->file('preview_img')->store('rooms/previews', 'public');
            $validatedData['preview_img'] = '/storage/' . $previewImagePath;
        }

       /* if ($request->hasFile('gallery')) {
            $galleryPaths = [];
            foreach ($request->file('gallery') as $file) {
                $path = $file->store('rooms/gallery', 'public');
                $galleryPaths[] = '/storage/' . $path;
            }
            $validatedData['gallery'] = $galleryPaths;
        }*/
        
        //$validatedData['gallery'] = json_encode($validatedData['gallery'] ?? []);
        $validatedData['is_available'] = filter_var($request->input('is_available'), FILTER_VALIDATE_BOOLEAN);
        Room::create($validatedData);
        return response()->json(null, 201);
    }

    public function show(int $id)
    {
        $room = Room::where('room_id', $id)->firstOrFail();
        return response()->json($room);
    }

    public function update(UpdateRoomRequest $request, int $id)
    {
        $room = Room::where('room_id', "=", $id);

        $validatedData = $request->validated();

        if ($request->hasFile('preview_img')) {
            $previewImagePath = $request->file('preview_img')->store('rooms/previews', 'public');
            $validatedData['preview_img'] = '/storage/' . $previewImagePath;
        } else if ($request->filled('preview_img')) {
            $validatedData['preview_img'] = $request->input('preview_img');
        } else {
            $validatedData['preview_img'] = $room->firstOrFail()->preview_img;
        }

        /*
        if ($request->hasFile('gallery')) {
            $galleryPaths = [];
            foreach ($request->file('gallery') as $file) {
                $path = $file->store('rooms/gallery', 'public');
                $galleryPaths[] = '/storage/' . $path;
            }
            $validatedData['gallery'] = $galleryPaths;
        } else if ($request->filled('gallery')) {
            $validatedData['gallery'] = $request->input('gallery');
        } else {
            $validatedData['gallery'] = $room->gallery; // Keep existing gallery if no new files and not explicitly removed
        }*/
        
        //$validatedData['gallery'] = json_encode($validatedData['gallery'] ?? []);

        if ($request->has('is_available')) {
            $validatedData['is_available'] = filter_var($request->input('is_available'), FILTER_VALIDATE_BOOLEAN);
        }

        $room->update($validatedData);
        return response()->json($room);
    }
    
    public function destroy(int $id)
    {
        $room = Room::where('room_id', $id)->firstOrFail();
        $room->delete();
        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
