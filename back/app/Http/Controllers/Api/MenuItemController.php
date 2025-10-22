<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class MenuItemController extends Controller
{
    public function index()
    {
        return response()->json(MenuItem::all());
    }

    public function store(Request $request)
    {
        $menuItem = MenuItem::create($request->all());
        return response()->json($menuItem, Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $menuItem = MenuItem::where('item_id', $id)->firstOrFail();
        return response()->json($menuItem);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id)
    {
        $menuItem = MenuItem::where('item_id', $id)->firstOrFail();
        $menuItem->update($request->all());
        return response()->json($menuItem);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $menuItem = MenuItem::where('item_id', $id)->firstOrFail();
        $menuItem->delete();
        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
