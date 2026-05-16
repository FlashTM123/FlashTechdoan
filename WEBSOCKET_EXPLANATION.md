# WebSocket & Real-time Notification Mechanism

## Giải thích Chi tiết cho Hội Đồng

### 1. Vấn đề Cơ bản

**Traditional HTTP Polling (Vấn đề cũ):**
```
Client: "Có order mới không?" (mỗi 5 giây)
Server: "Không" → Kết nối đóng
↓ (5 giây sau)
Client: "Có order mới không?"
Server: "Không" → Kết nối đóng
↓ (5 giây sau)
Client: "Có order mới không?"
Server: "Có! Order #123" → Kết nối đóng
```

**Vấn đề:**
- 60+ requests/hour per user
- High latency (5 second delay trước khi nhận thông báo)
- Tốn bandwidth & server resources
- Không phải real-time thực sự

---

### 2. Giải pháp: WebSocket (Two-way Communication)

**WebSocket Connection (Giải pháp mới):**
```
Client: [WebSocket Connection Established] ←→ Server
        Persistent tunnel (không đóng)

Client: READY TO RECEIVE
Server: [Order #123 created] → Client (ngay lập tức)
Server: [Order #456 created] → Client (ngay lập tức)
```

**Lợi ích:**
- Persistent connection (không cần reconnect)
- Duplex communication (2-chiều)
- Ultra-low latency (<100ms)
- Minimal bandwidth
- Truly real-time

---

### 3. WebSocket Handshake Protocol

```
Step 1: HTTP Upgrade Request (từ Client)
GET /ws HTTP/1.1
Host: localhost:8080
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==
Sec-WebSocket-Version: 13

Step 2: HTTP Upgrade Response (từ Server)
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: HSmrc0sMlYUkAGmm5OPpG2HaGWk=

Result: TCP socket upgraded to WebSocket
        Persistent connection established
```

---

### 4. Data Frame Format

**WebSocket Frame Structure:**
```
[FIN] [RSV] [OPCODE] [MASK] [PAYLOAD-LEN] [PAYLOAD]
  1     3      4        1        7-64bits      ≤126 bytes typical

Example:
FIN=1 (final frame)
OPCODE=0x1 (text data)
PAYLOAD: {"order_code": "ORD-123", "amount": 29999000}
```

**So sánh HTTP vs WebSocket:**
```
HTTP:    [HTTP Header ~300 bytes] [Data] → Kết nối đóng
WebSocket: [Frame ~4 bytes] [Data] → Giữ kết nối
```

---

### 5. Implementation trong FlashTech

### 5.1 Backend Flow

```typescript
// Step 1: Order được tạo
POST /checkout
→ Order::create([...])

// Step 2: Model Observer tự động trigger
app/Models/Observers/OrderObserver::created()
→ Bắn 2 sự kiện:
   a) OrderCreated::dispatchSync($order)
   b) $admin->notify(new OrderCreatedNotification($order))

// Step 3: Event được serialized
OrderCreated Event:
{
  order_code: "ORD-20260515-001",
  customer_name: "Nguyễn Văn A",
  total_amount: 29999000
}

// Step 4: Sent to Reverb Server
Reverb broadcasts on channel 'orders'
```

### 5.2 Channel System

**Public Channel (Admin Orders):**
```
Channel: 'orders'
Access: Bất kỳ ai kết nối được websocket đều nghe được
Use case: Tất cả admin nhận thông báo order mới
Broadcast: OrderCreated event

// JavaScript
window.Echo.channel('orders')
  .listen('OrderCreated', (data) => {
    showAdminNotification(data);
  });
```

**Private Channel (Customer Orders):**
```
Channel: 'orders.123' (123 = user_id)
Access: Chỉ user với ID 123 có thể subscribe
Reason: Security - không muốn user A thấy order của user B
Mechanism: Gửi auth token khi subscribe
Broadcast: OrderStatusUpdated event

// JavaScript
window.Echo.private(`orders.${userId}`)
  .listen('OrderStatusUpdated', (data) => {
    showCustomerNotification(data);
  });

// Server validates trong /broadcasting/auth endpoint
// Nếu unauthorized → từ chối subscription
```

---

### 6. Sequence Diagram: Order Created

```
ADMIN BROWSER              LARAVEL SERVER              REVERB SERVER           CUSTOMER BROWSER
     │                            │                          │                         │
     │ 1. Click "View Orders"     │                          │                         │
     ├──────────────────────────→ │                          │                         │
     │                       GET /orders                      │                         │
     │                            │ 2. WebSocket connected   │                         │
     │                            ├─────────────────────────→│                         │
     │                            │   ('orders' channel)     │                         │
     │                            │                          │                         │
     │                            │                          │                         │
CUSTOMER BROWSER                  │                          │                         │
     │                            │                          │                         │
     │ 3. POST /checkout          │                          │                         │
     │    (Create Order)          │                          │                         │
     ├──────────────────────────→ │                          │                         │
     │                  Order::create()                      │                         │
     │                  (trigger Observer)                   │                         │
     │                       │                                │                         │
     │                       └─→ OrderCreated::dispatchSync()│                         │
     │                            │ 4. Serialize event       │                         │
     │                            ├─────────────────────────→│                         │
     │                            │ (broadcast on 'orders')  │                         │
     │                            │                          │ 5. Broadcast to all    │
     │                            │                          │    connected on 'orders'
     │                            │                          ├────────────────────────→│
     │                            │                          │ (ADMIN's connection)   │
     │                            │                          │                         │ 6. Toast! 🔔
     │                            │                          │                         │ Update bell count
     │                            │                          │                         │
  ← ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
     │                       200 OK                          │                         │
     │ ← ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ← │                         │
     │                                                        │                         │
     │ 7. Show "Order Created" toast                         │                         │
     └─────────────────────────────────────────────────────→ │                         │
```

---

### 7. Code Implementation Example

**Backend: Event Broadcasting**
```php
// app/Events/OrderCreated.php
class OrderCreated implements ShouldBroadcast
{
    public function broadcastOn(): array
    {
        return [new Channel('orders')]; // Public channel
    }

    public function broadcastWith(): array
    {
        return [
            'order_code' => $this->order->order_code,
            'customer_name' => $this->order->user->name,
            'total_amount' => $this->order->total_amount,
        ];
    }
}

// Trigger
OrderCreated::dispatchSync($order); // Send ngay lập tức
```

**Frontend: Listen to Broadcast**
```typescript
// resources/js/bootstrap.ts
window.Echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: 'localhost',
    wsPort: 8080,
});

// resources/js/hooks/useRealtimeNotifications.ts
const ordersChannel = window.Echo.channel('orders');
ordersChannel.listen('OrderCreated', (data) => {
    // Real-time: Instantly called when broadcast received
    setNotifications(prev => [
        {
            id: `order-${data.order_code}`,
            message: `New order: ${data.order_code}`,
            ...data
        },
        ...prev
    ]);
});
```

---

### 8. Security Considerations

**Public vs Private Channels:**

| Aspect | Public Channel | Private Channel |
|--------|---|---|
| Access | Anyone on the web | Only authenticated users |
| Example | 'orders' | 'orders.123' |
| Use | Broadcast to admins | Personal customer updates |
| Authorization | None | Laravel middleware checks user_id |
| Token | Not needed | Generated & validated |

**Private Channel Authorization:**
```php
// routes/channels.php
Broadcast::private('orders.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id; // Chỉ user với ID đó có quyền
});
```

---

### 9. Performance Metrics

**Comparison:**

| Metric | HTTP Polling | WebSocket |
|--------|---|---|
| Latency | 5 seconds (1 poll interval) | <100ms |
| Requests/hour | 60+ per user | 0 (persistent) |
| Bandwidth | ~300 bytes/request | ~4 bytes/frame |
| Server Load | High | Very Low |
| CPU Usage | High (parsing HTTP headers) | Low |
| Scalability | Limited (~100 users) | Excellent (10k+ users) |

---

### 10. Advantages of Reverb Over Alternatives

**Compared to Pusher (3rd party):**
- ✅ Free & open-source
- ✅ No monthly costs
- ✅ Can host on your server
- ✅ Full control over data

**Compared to Socket.io (Node.js):**
- ✅ Native Laravel integration
- ✅ Use Laravel code for broadcasting
- ✅ Same language (PHP) for backend
- ✅ Simpler deployment

**Compared to Firebase Realtime DB:**
- ✅ Lightweight & fast
- ✅ No vendor lock-in
- ✅ Better for specific use cases (order notifications)

---

### 11. Mechanism Diagram (High-level)

```
┌─────────────┐                    ┌─────────────┐
│   Browser   │                    │   Laravel   │
│  (React)    │                    │   Server    │
└────────┬────┘                    └─────────────┘
         │                                │
    1. JS subscribes to                   │
       channel 'orders'                   │
         │──────────────────────────────→ │
         │   WebSocket Connection         │
         │←─────────────────────────────── │
         │   HTTP 101 (Upgrade)           │
         │                                │
         │                         2. Order created
         │                            │
         │                       OrderCreated Event
         │                            │
         │←──────────────────────────→ │
         │   WebSocket Frame          Broadcast
         │   (broadcast event)        to Reverb
         │                                │
    3. Toast!                        3. Message
       Notification badge                sent to
       Order list updates              WebSocket
```

---

### 12. Responding to Exam Questions

**Q: "Giải thích cơ chế WebSocket trong ứng dụng?"**

**A:**
"Ứng dụng sử dụng WebSocket thông qua Laravel Reverb. Khi đơn hàng được tạo, event OrderCreated được dispatch tới Reverb server. Reverb broadcast sự kiện trên channel 'orders' (public). Tất cả admin kết nối với channel này nhận được thông báo ngay lập tức (<100ms) thông qua persistent WebSocket connection.

Với order status update, sử dụng private channel 'orders.{user_id}' - chỉ customer có user_id đó mới nhận được thông báo update của đơn hàng của họ. Điều này đảm bảo security - một customer không thể thấy thông báo của customer khác.

Ưu điểm so với HTTP polling:
- Real-time thực sự (WebSocket vs HTTP cần reconnect)
- Latency thấp (<100ms)
- Giảm 90% requests/bandwidth
- Scalable hơn (connection persistent, không phải mở/đóng liên tục)"

**Q: "Tại sao dùng 2 channels (public + private)?"**

**A:**
"Public channel 'orders' cho admin notifications vì tất cả admin cần thấy tất cả order mới - đây là business requirement.

Private channel 'orders.{user_id}' cho customer vì mỗi customer chỉ quan tâm order của họ. Nếu dùng public channel, tất cả user đều thấy thông báo của tất cả user khác - vi phạm privacy."

**Q: "Nếu WebSocket ngắt kết nối thì sao?"**

**A:**
"Echo library có built-in reconnection logic. Nếu WebSocket ngắt, nó sẽ tự động reconnect. Và notifications được lưu trong database (notifications table), nên user sẽ thấy lịch sử notifications. Khi reconnect, có thể fetch notifications chưa đọc từ database."

---

## Tóm tắt

Thay vì server liên tục check "có message mới không?" (polling), WebSocket tạo persistent connection cho phép server **push** data tới client ngay lập tức khi có sự kiện. Đây là cơ chế đứng sau các ứng dụng real-time hiện đại (Slack, Facebook, Gmail, v.v.).

Trong FlashTech, Reverb là WebSocket server, Laravel Events là mechanism gửi broadcast, Echo là client library subscribe & listen, React components render notifications khi nhận data.

