<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $allCount = HallNew::get()->count();

        if ($allCount > 0) return response()->json(['message' => "Вы не можете создать более 1 зала в данной системе"], 422);
        $hall = HallNew::create($request->all());
        return response()->json($hall, 201);
    }

    public function show(HallNew $hallNew)
    {
        return response()->json($hallNew->load('hallRoomsNew'));
    }

    public function update(Request $request, HallNew $hallNew)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'width' => 'integer',
            'height' => 'integer',
            'svg_background' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $hallNew->update($request->all());
        return response()->json($hallNew);
    }

    public function destroy(HallNew $hallNew)
    {
        $hallNew->delete();
        return response()->json(null, 204);
    }
}
