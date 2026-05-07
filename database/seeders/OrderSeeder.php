<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        // Chỉ lấy những User có role là customer để đặt hàng
        $customers = User::where('role', 'customer')->get();
        $products = Product::all();
        $paymentMethods = \App\Models\PaymentMethod::all();

        if ($customers->isEmpty() || $products->isEmpty() || $paymentMethods->isEmpty()) {
            return;
        }

        foreach (range(1, 10) as $index) {
            $customer = $customers->random();

            // Tạo một đơn hàng mẫu
            $order = Order::create([
                'user_id' => $customer->id,
                'order_code' => 'FT-' . strtoupper(Str::random(8)),
                'total_amount' => 0, // Sẽ tính toán lại sau khi tạo items
                'shipping_address' => 'Số ' . rand(1, 100) . ' Đường ' . Str::random(5) . ', Quận ' . rand(1, 10) . ', TP. Hồ Chí Minh',
                'payment_method_id' => $paymentMethods->random()->id,
                'payment_status' => 'pending',
                'order_status' => 'pending', // Mặc định là chờ duyệt
                'processed_by_id' => null,  // Chưa có người duyệt
                'notes' => 'Ghi chú cho đơn hàng thứ ' . $index,
            ]);

            $totalAmount = 0;
            // Mỗi đơn hàng có từ 1 đến tối đa 3 sản phẩm (hoặc số sản phẩm hiện có)
            $count = min(rand(1, 3), $products->count());
            $orderProducts = $products->random($count);

            foreach ($orderProducts as $product) {
                // Đảm bảo variant tồn tại
                $variant = $product->variants->isNotEmpty() ? $product->variants->random() : null;
                if (!$variant) continue;

                $quantity = rand(1, 2);
                $price = $variant->price;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'product_variants_id' => $variant->id,
                    'quantity' => $quantity,
                    'unit_price' => $price,
                ]);

                $totalAmount += ($price * $quantity);
            }

            // Cập nhật lại tổng tiền thực tế của đơn hàng
            $order->update(['total_amount' => $totalAmount]);
        }
    }
}
