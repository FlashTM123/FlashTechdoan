<?php

namespace App\Models\Observers;

use App\Events\OrderCreated;
use App\Events\OrderStatusUpdated;
use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\Event;

class OrderObserver
{
    public function created(Order $order): void
    {
        Event::dispatch(new OrderCreated($order));

        $admins = User::where('role', 'admin')->get();
        
        foreach ($admins as $admin) {
            \Filament\Notifications\Notification::make()
                ->title('Đơn hàng mới')
                ->body("Đơn hàng #{$order->order_code} vừa được đặt, chờ xử lý.")
                ->icon('heroicon-o-shopping-bag')
                ->color('success')
                ->actions([
                    \Filament\Actions\Action::make('view')
                        ->label('Xem đơn')
                        ->url(url("/admin/orders/{$order->id}/edit"))
                        ->button(),
                ])
                ->sendToDatabase($admin);
        }
    }

    public function updated(Order $order): void
    {
        if ($order->isDirty('order_status')) {
            Event::dispatch(new OrderStatusUpdated($order));
        }
    }
}
