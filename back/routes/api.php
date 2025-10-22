<?php
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\MenuItemController;
use App\Http\Controllers\Api\OrderController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::apiResource('rooms', RoomController::class);
Route::apiResource('categories', CategoryController::class);
Route::apiResource('menuitems', MenuItemController::class);
Route::apiResource('orders', OrderController::class);
Route::put('/orders/{order}/status', [OrderController::class, 'updateStatus']);

?>
