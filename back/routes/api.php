<?php

use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\MenuItemController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ReviewController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', [AuthController::class, 'index']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/users/{id}/role', [AuthController::class, 'updateUserRole']);

Route::get('/rooms', [RoomController::class, 'index']);
Route::get('/rooms/{id}', [RoomController::class, 'show']);

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);

Route::get('/menuitems', [MenuItemController::class, 'index']);
Route::get('/menuitems/category/{category_id}', [MenuItemController::class, 'getProductsByCategory']);
Route::get('/menuitems/{id}', [MenuItemController::class, 'show']);

Route::get('/halls_new', [\App\Http\Controllers\Api\HallNewController::class, 'index']);
Route::get('/halls_new/{hallNew}', [\App\Http\Controllers\Api\HallNewController::class, 'show']);
Route::get('/halls_new/{hallNew}/hall_rooms_new', [\App\Http\Controllers\Api\HallRoomNewController::class, 'index']);
Route::get('/halls_new/{hallNew}/hall_rooms_new/{hallRoomNew}', [\App\Http\Controllers\Api\HallRoomNewController::class, 'show']);

Route::get('/reviews', [ReviewController::class, 'index']);
Route::get('/reviews/{review}', [ReviewController::class, 'show']);
Route::get('/orders/{orderId}/reviews', [ReviewController::class, 'getByOrder']);
Route::get('/users/{userId}/reviews', [ReviewController::class, 'getByUser']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders-user', [OrderController::class, 'ordersForUser']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::put('/orders/{id}', [OrderController::class, 'update']);
    Route::post('/orders/{id}/status', [OrderController::class, 'updateStatus']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::delete('/orders/{id}', [OrderController::class, 'destroy']);

    Route::get('/cart', [\App\Http\Controllers\Api\CartController::class, 'show']);
    Route::get('/cart/check-room-type', [\App\Http\Controllers\Api\CartController::class, 'checkAddMenuItem']);
    Route::put('/cart/menu-item/{cartMenuItem}', [\App\Http\Controllers\Api\CartController::class, 'updateMenuItem']);
    Route::put('/cart/room/{cartRoom}', [\App\Http\Controllers\Api\CartController::class, 'updateRoom']);
    Route::post('/cart/room', [\App\Http\Controllers\Api\CartController::class, 'addRoom']);
    Route::post('/cart/menu-item', [\App\Http\Controllers\Api\CartController::class, 'addMenuItem']);
    Route::delete('/cart/room/{cartRoom}', [\App\Http\Controllers\Api\CartController::class, 'removeRoom']);
    Route::delete('/cart/clear', [\App\Http\Controllers\Api\CartController::class, 'clearCart']);
    Route::delete('/cart/menu-item/{cartMenuItem}', [\App\Http\Controllers\Api\CartController::class, 'removeMenuItem']);

    Route::get('/halls_new/{hallNew}/hall_rooms_availability', [\App\Http\Controllers\Api\HallRoomNewController::class, 'getHallRoomsAvailability']);
   
    Route::get('/reviews/my', [ReviewController::class, 'myReviews']);
    Route::post('/reviews', [ReviewController::class, 'store']);
    Route::delete('/reviews/{review}', [ReviewController::class, 'destroy']);

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

        Route::post('/halls_new', [\App\Http\Controllers\Api\HallNewController::class, 'store']);
        Route::put('/halls_new/{hallNew}', [\App\Http\Controllers\Api\HallNewController::class, 'update']);
        Route::delete('/halls_new/{hallNew}', [\App\Http\Controllers\Api\HallNewController::class, 'destroy']);
    
        Route::post('/halls_new/{hallNew}/hall_rooms_new', [\App\Http\Controllers\Api\HallRoomNewController::class, 'store']);
        Route::put('/halls_new/{hallNew}/hall_rooms_new/{hallRoomNew}', [\App\Http\Controllers\Api\HallRoomNewController::class, 'update']);
        Route::delete('/halls_new/{hallNew}/hall_rooms_new/{hallRoomNew}', [\App\Http\Controllers\Api\HallRoomNewController::class, 'destroy']);
    });
});

?>
