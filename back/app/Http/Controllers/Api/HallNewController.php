<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreHall;
use App\Models\HallNew;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class HallNewController extends Controller
{
    public function index()
    {
        $halls = HallNew::withCount('hallRoomsNew')->get();
        return response()->json($halls);
    }

    public function store(StoreHall $request)
    {
        $validated = $request->validated();

        $hall = HallNew::create($validated);
        return response()->json($hall, 201);
    }

    public function show(HallNew $hallNew)
    {
        return response()->json($hallNew->load('hallRoomsNew'));
    }

    public function update(StoreHall $request, HallNew $hallNew)
    {
        $validated = $request->validated();

        $hallNew->update($validated);
        return response()->json($hallNew);
    }

    public function destroy(HallNew $hallNew)
    {
        $hallNew->delete();
        return response()->json(null, 204);
    }
}
