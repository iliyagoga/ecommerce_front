<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HallNew;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class HallNewController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $halls = HallNew::withCount('hallRoomsNew')->get();
        return response()->json($halls);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'width' => 'required|integer',
            'height' => 'required|integer',
            'svg_background' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $hall = HallNew::create($request->all());
        return response()->json($hall, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(HallNew $hallNew)
    {
        return response()->json($hallNew->load('hallRoomsNew'));
    }

    /**
     * Update the specified resource in storage.
     */
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

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(HallNew $hallNew)
    {
        $hallNew->delete();
        return response()->json(null, 204);
    }
}
