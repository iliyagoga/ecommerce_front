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
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:standard,vip,cinema',
            'base_hourly_rate' => 'required|numeric|min:0',
            'initial_fee' => 'required|numeric|min:0',
            'max_people' => 'required|integer|min:1',
            'description' => 'nullable|string',
            'preview_img' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

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
        dump($validatedData);
        $room = Room::create($validatedData);
        return response()->json($room, Response::HTTP_CREATED);
    }

    public function show(int $id)
    {
        $room = Room::where('room_id', $id)->firstOrFail();
        return response()->json($room);
    }

    public function update(Request $request, int $id)
    {
        $room = Room::where('room_id', "=", $id);

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:standard,vip,cinema',
            'base_hourly_rate' => 'required|numeric|min:0',
            'initial_fee' => 'required|numeric|min:0',
            'max_people' => 'required|integer|min:1',
            'description' => 'nullable|string',
            'preview_img' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'gallery' => 'nullable|array',
            'gallery.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($request->hasFile('preview_img')) {
            $previewImagePath = $request->file('preview_img')->store('rooms/previews', 'public');
            $validatedData['preview_img'] = '/storage/' . $previewImagePath;
        } else if ($request->filled('preview_img')) {
            $validatedData['preview_img'] = $request->input('preview_img');
        } else {
            $validatedData['preview_img'] = $room->firstOrFail()->preview_img;
        }

        /*// Handle gallery images upload
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
