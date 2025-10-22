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

    public function show(MenuItem $menuItem)
    {
        return response()->json($menuItem);
    }

    public function update(Request $request, MenuItem $menuItem)
    {
        $menuItem->update($request->all());
        return response()->json($menuItem);
    }

    public function destroy(MenuItem $menuItem)
    {
        $menuItem->delete();
        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
