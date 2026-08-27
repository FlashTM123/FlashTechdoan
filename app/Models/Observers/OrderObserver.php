<?php

namespace App\Models\Observers;

use App\Events\OrderCreated;
use App\Events\OrderStatusUpdated;
use App\Models\Order;
use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Log;

class OrderObserver
{
    /**
     * Tỉ lệ tích điểm: 1 điểm cho mỗi 10.000đ giá trị đơn hàng.
     */
    const POINTS_PER_VND = 100000; // 1 điểm / 100.000đ

    /**
     * Luồng chuyển trạng thái hợp lệ.
     * Key = trạng thái hiện tại, value = các trạng thái cho phép chuyển đến.
     */
    private const ALLOWED_TRANSITIONS = [
        'pending'    => ['pending', 'processing', 'cancelled'],
        'processing' => ['processing', 'shipped', 'cancelled'],
        'shipped'    => ['shipped', 'delivered'],
        'delivered'  => ['delivered'],
        'cancelled'  => ['cancelled'],
    ];

    private const STATUS_LABELS = [
        'pending'    => 'Chờ xử lý',
        'processing' => 'Đang đóng gói',
        'shipped'    => 'Đang vận chuyển',
        'delivered'  => 'Đã giao hàng',
        'cancelled'  => 'Đã hủy',
    ];

    /**
     * Validate chuyển trạng thái TRƯỚC KHI lưu vào DB.
     * getOriginal('order_status') luôn trả về giá trị DB thực — không bị stale.
     * Return false → Laravel hủy lệnh save().
     */
    public function updating(Order $order)
    {
        if (!$order->isDirty('order_status')) {
            return;
        }

        $newStatus  = $order->order_status;
        $prevStatus = $order->getOriginal('order_status') ?? 'pending';

        if (empty($newStatus)) {
            return; // Để DB constraint xử lý
        }

        $allowed = self::ALLOWED_TRANSITIONS[$prevStatus] ?? array_keys(self::STATUS_LABELS);

        if (!in_array($newStatus, $allowed)) {
            // Hoàn tác trong memory
            $order->order_status = $prevStatus;

            $prevLabel = self::STATUS_LABELS[$prevStatus] ?? $prevStatus;
            $newLabel  = self::STATUS_LABELS[$newStatus]  ?? $newStatus;

            // Gửi thông báo Filament
            try {
                \Filament\Notifications\Notification::make()
                    ->title('❌ Chuyển trạng thái không hợp lệ')
                    ->body("Không thể chuyển từ \"{$prevLabel}\" sang \"{$newLabel}\". Phải theo thứ tự: Chờ xử lý → Đang đóng gói → Đang vận chuyển → Đã giao hàng.")
                    ->danger()
                    ->persistent()
                    ->send();
            } catch (\Exception $e) {
                Log::warning("OrderObserver: transition notification failed - " . $e->getMessage());
            }

            return false; // Hủy save
        }
    }

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
                ->broadcast($admin);
        }
    }

    public function updated(Order $order): void
    {
        if ($order->isDirty('order_status')) {
            Event::dispatch(new OrderStatusUpdated($order));

            // ── Cộng điểm khi đơn hàng được giao thành công ─────────────
            if ($order->order_status === 'delivered') {
                $this->awardLoyaltyPoints($order);
            }

            // ── Hoàn điểm nếu đơn bị hủy SAU KHI đã cộng ───────────────
            if (in_array($order->order_status, ['cancelled', 'refunded']) &&
                in_array($order->getOriginal('order_status'), ['delivered'])) {
                $this->revokeLoyaltyPoints($order);
            }
        }
    }

    /**
     * Tính và cộng điểm vào profile người dùng.
     * Công thức: floor(total_amount / 10.000) điểm
     */
    private function awardLoyaltyPoints(Order $order): void
    {
        $user = $order->user;

        if (!$user) return;

        $pointsToAdd = (int) floor((float) $order->total_amount / self::POINTS_PER_VND);

        if ($pointsToAdd <= 0) return;

        // Upsert profile nếu chưa có
        $profile = UserProfile::firstOrCreate(
            ['user_id' => $user->id],
            ['points' => 0]
        );

        $profile->increment('points', $pointsToAdd);

        Log::info("LoyaltyPoints: +{$pointsToAdd} điểm cho user #{$user->id} ({$user->name}) từ đơn #{$order->order_code}");

        // Thông báo cho khách hàng
        try {
            \Filament\Notifications\Notification::make()
                ->title("🎉 Bạn nhận được {$pointsToAdd} điểm!")
                ->body("Cảm ơn bạn đã mua hàng. Đơn #{$order->order_code} đã hoàn thành.")
                ->icon('heroicon-o-star')
                ->color('warning')
                ->broadcast($user);
        } catch (\Exception $e) {
            // Không làm crash nếu notification lỗi
            Log::warning("LoyaltyPoints notification failed: " . $e->getMessage());
        }
    }

    /**
     * Thu hồi điểm nếu đơn hàng bị hủy sau khi đã giao thành công.
     */
    private function revokeLoyaltyPoints(Order $order): void
    {
        $user = $order->user;

        if (!$user || !$user->profile) return;

        $pointsToRevoke = (int) floor((float) $order->total_amount / self::POINTS_PER_VND);

        if ($pointsToRevoke <= 0) return;

        // Không để điểm xuống dưới 0
        $currentPoints = $user->profile->points ?? 0;
        $newPoints = max(0, $currentPoints - $pointsToRevoke);

        $user->profile->update(['points' => $newPoints]);

        Log::info("LoyaltyPoints: -{$pointsToRevoke} điểm thu hồi từ user #{$user->id} ({$user->name}) do hủy đơn #{$order->order_code}");
    }
}
