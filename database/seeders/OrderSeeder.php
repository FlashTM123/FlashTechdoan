<?php

namespace Database\Seeders;

use App\Models\Customer;
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
        $customers = Customer::all();
        $products = Product::all();

        if ($customers->isEmpty() || $products->isEmpty()) {
            return;
        }

        foreach (range(1, 10) as $index) {
            $customer = $customers->random();

            // Tạo một đơn hàng mẫu
            $order = Order::create([
                'customer_id' => $customer->id,
                'order_code' => 'FT-' . strtoupper(Str::random(8)),
                'total_amount' => 0, // Sẽ tính toán lại sau khi tạo items
                'shipping_address' => 'Số ' . rand(1, 100) . ' Đường ' . Str::random(5) . ', Quận ' . rand(1, 10) . ', TP. Hồ Chí Minh',
                'payment_method' => collect(['cod', 'vnpay', 'momo'])->random(),
                'payment_status' => collect(['pending', 'paid'])->random(),
                'order_status' => collect(['pending', 'processing', 'shipped', 'delivered'])->random(),
                'notes' => 'Ghi chú cho đơn hàng thứ ' . $index,
            ]);

            $totalAmount = 0;
            // Mỗi đơn hàng có từ 1-3 sản phẩm
            $orderProducts = $products->random(rand(1, 3));

            foreach ($orderProducts as $product) {
                $variant = $product->variants->random();
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
