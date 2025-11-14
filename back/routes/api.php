<?php

use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\MenuItemController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\HallNewController;
use App\Http\Controllers\Api\HallRoomNewController;
use App\Http\Controllers\Api\CartController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::controller(AuthController::class)->group(function () {
    Route::get('/user', 'index');
    Route::post('/register', 'register');
    Route::post('/login', 'login');
    Route::post('/users/{id}/role', 'updateUserRole');
});

Route::controller(RoomController::class)->group(function () {
    Route::get('/rooms', 'index');
    Route::get('/rooms/{id}', 'show');
});

Route::controller(CategoryController::class)->group(function () {
    Route::get('/categories', 'index');
    Route::get('/categories/{id}', 'show');
});

Route::controller(MenuItemController::class)->group(function () {
    Route::get('/menuitems', 'index');
    Route::get('/menuitems/category/{category_id}', 'getProductsByCategory');
    Route::get('/menuitems/{id}', 'show');
});

Route::controller(HallNewController::class)->group(function () {
    Route::get('/halls_new', 'index');
    Route::get('/halls_new/{hallNew}', 'show');
});

Route::controller(HallRoomNewController::class)->group(function () {
    Route::get('/halls_new/{hallNew}/hall_rooms_new', 'index');
    Route::get('/halls_new/{hallNew}/hall_rooms_new/{hallRoomNew}', 'show');
});

Route::controller(ReviewController::class)->group(function () {
    Route::get('/reviews', 'index');
    Route::get('/reviews/{review}', 'show');
    Route::get('/orders/{orderId}/reviews', 'getByOrder');
    Route::get('/users/{userId}/reviews', 'getByUser');
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::controller(OrderController::class)->group(function () {
        Route::get('/orders', 'index');
        Route::get('/orders-user', 'ordersForUser');
        Route::get('/orders/{id}', 'show');
        Route::put('/orders/{id}', 'update');
        Route::post('/orders/{id}/status', 'updateStatus');
        Route::post('/orders', 'store');
        Route::delete('/orders/{id}', 'destroy');
    });

    Route::controller(CartController::class)->group(function () {
        Route::get('/cart', 'show');
        Route::get('/cart/check-room-type', 'checkAddMenuItem');
        Route::put('/cart/menu-item/{cartMenuItem}', 'updateMenuItem');
        Route::put('/cart/room/{cartRoom}', 'updateRoom');
        Route::post('/cart/room', 'addRoom');
        Route::post('/cart/menu-item', 'addMenuItem');
        Route::delete('/cart/room/{cartRoom}', 'removeRoom');
        Route::delete('/cart/clear', 'clearCart');
        Route::delete('/cart/menu-item/{cartMenuItem}', 'removeMenuItem');
    });

    Route::controller(HallRoomNewController::class)->group(function () {
        Route::get('/halls_new/{hallNew}/hall_rooms_availability', 'getHallRoomsAvailability');
    });

    Route::controller(ReviewController::class)->group(function () {
        Route::get('/reviews/my', 'myReviews');
        Route::post('/reviews', 'store');
        Route::delete('/reviews/{review}', 'destroy');
    });

    Route::middleware('admin')->group(function () {
        Route::controller(RoomController::class)->group(function () {
            Route::post('/rooms', 'store');
            Route::post('/rooms/{id}', 'update');
            Route::delete('/rooms/{id}', 'destroy');
        });

        Route::controller(CategoryController::class)->group(function () {
            Route::post('/categories', 'store');
            Route::put('/categories/{id}', 'update');
            Route::delete('/categories/{id}', 'destroy');
        });

        Route::controller(MenuItemController::class)->group(function () {
            Route::post('/menuitems', 'store');
            Route::post('/menuitems/{id}', 'update');
            Route::delete('/menuitems/{id}', 'destroy');
        });

        Route::controller(HallNewController::class)->group(function () {
            Route::post('/halls_new', 'store');
            Route::put('/halls_new/{hallNew}', 'update');
            Route::delete('/halls_new/{hallNew}', 'destroy');
        });

        Route::controller(HallRoomNewController::class)->group(function () {
            Route::post('/halls_new/{hallNew}/hall_rooms_new', 'store');
            Route::put('/halls_new/{hallNew}/hall_rooms_new/{hallRoomNew}', 'update');
            Route::delete('/halls_new/{hallNew}/hall_rooms_new/{hallRoomNew}', 'destroy');
        });
    });
});

?>