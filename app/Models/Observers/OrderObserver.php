<?php

namespace App\Models\Observers;

use App\Events\OrderCreated;
use App\Events\OrderStatusUpdated;
use App\Models\Order;
use App\Models\User;
use App\Notifications\OrderCreatedNotification;
use App\Notifications\OrderStatusUpdateNotification;
use Illuminate\Support\Facades\Event;

class OrderObserver
{
    public function created(Order $order): void
    {
        Event::dispatch(new OrderCreated($order));

        $admins = User::where('role', 'admin')->get();
        foreach ($admins as $admin) {
            $admin->notify(new OrderCreatedNotification($order));
        }
    }

    public function updated(Order $order): void
    {
        if ($order->isDirty('order_status')) {
            Event::dispatch(new OrderStatusUpdated($order));

            if ($order->user) {
                $order->user->notify(new OrderStatusUpdateNotification($order));
            }
        }
    }
}
