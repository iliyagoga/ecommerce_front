<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CategoryController extends Controller
{

    public function index()
    {
        return response()->json(Category::all());
    }

    public function store(Request $request)
    {
        $category = Category::create($request->all());
        return response()->json($category, Response::HTTP_CREATED);
    }

    public function show(int $id)
    {
        $category = Category::where('category_id', $id)->firstOrFail();
        return response()->json($category);
    }

    public function update(Request $request, int $id)
    {
        $category = Category::where('category_id', "=", $id);
        $category->update($request->all());
        return response()->json($category);
    }

    public function destroy(int $id)
    {
        $category = Category::where('category_id', "=", $id);
        $category->delete();
        return response()->json($category, Response::HTTP_NO_CONTENT);
    }
}
