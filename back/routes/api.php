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

// Маршруты для Rooms
Route::get('/rooms', [RoomController::class, 'index']);
Route::post('/rooms', [RoomController::class, 'store']);
Route::get('/rooms/{id}', [RoomController::class, 'show']);
Route::put('/rooms/{id}', [RoomController::class, 'update']);
Route::delete('/rooms/{id}', [RoomController::class, 'destroy']);

// Маршруты для Categories
Route::get('/categories', [CategoryController::class, 'index']);
Route::post('/categories', [CategoryController::class, 'store']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);
Route::put('/categories/{id}', [CategoryController::class, 'update']);
Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

// Маршруты для MenuItems
Route::get('/menuitems', [MenuItemController::class, 'index']);
Route::post('/menuitems', [MenuItemController::class, 'store']);
Route::get('/menuitems/{id}', [MenuItemController::class, 'show']);
Route::put('/menuitems/{id}', [MenuItemController::class, 'update']);
Route::delete('/menuitems/{id}', [MenuItemController::class, 'destroy']);

// Маршруты для Orders
Route::get('/orders', [OrderController::class, 'index']);
Route::post('/orders', [OrderController::class, 'store']);
Route::get('/orders/{id}', [OrderController::class, 'show']);
Route::put('/orders/{id}', [OrderController::class, 'update']);
Route::delete('/orders/{id}', [OrderController::class, 'destroy']);
Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);

?>
