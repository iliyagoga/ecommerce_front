<?php

use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\MenuItemController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/users/{id}/role', [AuthController::class, 'updateUserRole']);

Route::get('/rooms', [RoomController::class, 'index']);
Route::get('/rooms/{id}', [RoomController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);
Route::get('/menuitems', [MenuItemController::class, 'index']);
Route::get('/menuitems/{id}', [MenuItemController::class, 'show']);


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);

    Route::post('/orders', [OrderController::class, 'store']);
    Route::put('/orders/{id}', [OrderController::class, 'update']);
    Route::delete('/orders/{id}', [OrderController::class, 'destroy']);
    Route::post('/orders/{id}/status', [OrderController::class, 'updateStatus']);

    Route::middleware('admin')->group(function () {
        Route::post('/rooms', [RoomController::class, 'store']);
        Route::post('/rooms/{id}', [RoomController::class, 'update']); 
        Route::delete('/rooms/{id}', [RoomController::class, 'destroy']);


        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{id}', [CategoryController::class, 'update']);
        Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);


        Route::post('/menuitems', [MenuItemController::class, 'store']);
        Route::post('/menuitems/{id}', [MenuItemController::class, 'update']); 
        Route::delete('/menuitems/{id}', [MenuItemController::class, 'destroy']);
    });
});

?>
