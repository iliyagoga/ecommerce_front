<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMenuItemRequest;
use App\Http\Requests\UpdateMenuItemRequest;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class MenuItemController extends Controller
{
    public function index()
    {
        return response()->json(MenuItem::all());
    }

    public function getProductsByCategory(?int $category_id = null)
    {
        $query = MenuItem::with('category');

        if ($category_id) {
            $query->where('category_id', $category_id);
        }

        $menuItems = $query->get();
        return response()->json($menuItems);
    }

    public function store(StoreMenuItemRequest $request)
    {
        $validatedData = $request->validated();

        if ($request->hasFile('image_url')) {
            $imagePath = $request->file('image_url')->store('images', 'public');
            $validatedData['image_url'] = '/storage/' . $imagePath;
        }

        $validatedData['is_available'] = filter_var($request->input('is_available'), FILTER_VALIDATE_BOOLEAN);
        $menuItem = MenuItem::create($validatedData);
        return response()->json($menuItem, Response::HTTP_CREATED);
    }

    public function show(int $id)
    {
        $menuItem = MenuItem::where('item_id', $id)->firstOrFail();
        return response()->json($menuItem);
    }

    public function update(UpdateMenuItemRequest $request, int $id)
    {

        $validatedData = $request->validated();

        $menuItem = MenuItem::where('item_id', "=", $id);
        $imageUrl = $menuItem->firstOrFail()->image_url;

        if ($request->hasFile('image_url')) {
            $imagePath = $request->file('image_url')->store('images', 'public');
            $imageUrl = '/storage/' . $imagePath;
        } elseif ($request->filled('image_url')) {
            $imageUrl = $request->input('image_url');
        }

        $validatedData['image_url'] = $imageUrl;

        if ($request->has('is_available')) {
            $validatedData['is_available'] = filter_var($request->input('is_available'), FILTER_VALIDATE_BOOLEAN);
        }

        $menuItem->update($validatedData);
        return response()->json($menuItem);
    }


    public function destroy(int $id)
    {
        $menuItem = MenuItem::where('item_id', $id)->firstOrFail();
        $menuItem->delete();
        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
