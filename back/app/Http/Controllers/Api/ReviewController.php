<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Order;
use App\Http\Requests\StoreReviewRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class ReviewController extends Controller
{
    public function index()
    {
        $reviews = Review::with(['user'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($reviews);
    }

    public function myReviews()
    {
        $userId = Auth::id();
        
        $reviews = Review::with(['order', 'user'])
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($reviews);
    }

    public function store(StoreReviewRequest $request)
    {
        $validated = $request->validated();

        $order = Order::where('order_id', $validated['order_id'])
            ->where('user_id', Auth::id())
            ->where("status", "completed")
            ->first();
        $review = Review::where('order_id', $validated['order_id'])
        ->where('user_id', Auth::id())
        ->first();

        if ($review) {
            throw ValidationException::withMessages([
                'order' => ['Вы уже оставляли отзыв на этот заказ']
            ]);
        }
        if (!$order) {
            throw ValidationException::withMessages([
                'order' => ['Заказ не найден или не завершен']
            ]);
        }
        
        Review::create([
            'order_id' => $validated['order_id'],
            'user_id' => Auth::id(),
            'review' => $validated['review'],
        ]);


        return response()->json(true, 201);
    }

    public function show(Review $review)
    {
        $review->load(['order', 'user']);
        
        return response()->json($review);
    }

    public function destroy(Review $review)
    {
        if ($review->user_id !== Auth::id()) {
            return response()->json([
                'message' => 'Вы можете удалять только свои отзывы'
            ], 403);
        }

        $review->delete();

        return response()->json(null, 204);
    }

    public function getByOrder($orderId)
    {
        $reviews = Review::with(['order', 'user'])
            ->where('order_id', $orderId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($reviews);
    }

    public function getByUser($userId)
    {
        $reviews = Review::with(['order', 'user'])
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($reviews);
    }
}