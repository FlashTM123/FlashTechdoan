# Laravel Reverb Real-time Notifications Setup Guide

## Overview
Hướng dẫn tích hợp Laravel Reverb WebSocket cho real-time thông báo đơn hàng trong FlashTech e-commerce platform.

---

## Cấu Trúc Hoạt động

### Backend Flow:
1. **Order Created** → `OrderObserver` watches Order model
2. → Fires `OrderCreated` event (public broadcast)
3. → Sends `OrderCreatedNotification` to all admins
4. → Admin receives toast notification + notification badge

### Order Status Updated:
1. **Admin updates status** in Filament panel
2. → `OrderObserver` detects `order_status` change
3. → Fires `OrderStatusUpdated` event (private channel)
4. → Sends `OrderStatusUpdateNotification` to customer
5. → Customer receives real-time notification

---

## Chạy Server Locally

### Yêu cầu:
- PHP 8.1+
- Node.js 16+
- MySQL
- Composer

### Step 1: Backend Setup (Terminal 1)

```bash
cd "C:\Users\minhz\Documents\Graduation project\FlashTech"

# Nếu chưa cài dependencies
composer install --ignore-platform-req=ext-mongodb

# Chạy migrations (nếu cần)
php artisan migrate

# Chạy Laravel dev server (port 8000)
php artisan serve
```

Kiểm tra: http://localhost:8000

---

### Step 2: Reverb WebSocket Server (Terminal 2)

```bash
cd "C:\Users\minhz\Documents\Graduation project\FlashTech"

# Start Reverb server (port 8080, mặc định)
php artisan reverb:start
```

Output sẽ hiển thị:
```
Reverb server running on ws://127.0.0.1:8080
```

**Important:** Giữ terminal này chạy. Reverb cần hoạt động để WebSocket broadcast.

---

### Step 3: Frontend Dev Server (Terminal 3)

```bash
cd "C:\Users\minhz\Documents\Graduation project\FlashTech"

# Cài npm packages (nếu chưa)
npm install laravel-echo pusher-js --legacy-peer-deps

# Chạy Vite dev server
npm run dev
```

Kiểm tra: http://localhost:5173 hoặc cái port mà Vite chỉ định

---

## Testing Real-time Notifications

### Scenario 1: Admin nhận thông báo khi có đơn hàng mới

1. **Mở 2 browser windows:**
   - Window 1: http://localhost:8000 (đăng nhập as Customer)
   - Window 2: http://localhost:8000/admin (đăng nhập as Admin)

2. **Customer creates order:**
   - Click "Checkout" → Place order
   - Observe order created

3. **Admin receives notification:**
   - Check Window 2 notification bell icon
   - Should show toast: "New order received: #ORDER_CODE"
   - Unread count badge appears (red badge with number)

### Scenario 2: Customer nhận thông báo khi admin cập nhật trạng thái

1. **Admin updates order status:**
   - Go to Filament Admin panel → Orders resource
   - Select an order
   - Change `order_status` from "pending" → "processing"
   - Save

2. **Customer receives notification:**
   - Check Window 1 (customer browser)
   - Toast appears: "Your order status has been updated to: processing"
   - Notification bell badge updates
   - Status badge shows "processing" with blue color

---

## .env Configuration

Kiểm tra `.env` file có các settings này:

```env
BROADCAST_CONNECTION=reverb

REVERB_APP_ID=862563
REVERB_APP_KEY=pxlm4szc3e9ds4vikrle
REVERB_APP_SECRET=frcxm11qyfsonladshgn
REVERB_HOST="localhost"
REVERB_PORT=8080
REVERB_SCHEME=http

VITE_REVERB_APP_KEY="${REVERB_APP_KEY}"
VITE_REVERB_HOST="${REVERB_HOST}"
VITE_REVERB_PORT="${REVERB_PORT}"
VITE_REVERB_SCHEME="${REVERB_SCHEME}"
```

---

## Architecture & Mechanism

### 1. Events (Server-side broadcast)

**File:** `app/Events/OrderCreated.php`
- Channel: `public/orders` (accessible to all)
- Triggers: When new Order is created
- Payload: order_code, customer_name, total_amount, status

**File:** `app/Events/OrderStatusUpdated.php`
- Channel: `private/orders.{user_id}` (only for that user)
- Triggers: When order_status is modified
- Payload: order_code, new_status, message

### 2. Notifications (Database + Broadcast)

**File:** `app/Notifications/OrderCreatedNotification.php`
- Via: database, broadcast
- Recipients: All users with role "admin"
- Stores in `notifications` table for persistence

**File:** `app/Notifications/OrderStatusUpdateNotification.php`
- Via: broadcast
- Recipients: Customer (order.user_id)
- Real-time only (not persisted to DB for customers)

### 3. Model Observer

**File:** `app/Models/Observers/OrderObserver.php`
- Watches Order model for `created` and `updated` events
- Fires corresponding Events and Notifications

### 4. Frontend (React + TypeScript)

**Hook:** `resources/js/hooks/useRealtimeNotifications.ts`
- Connects to Reverb via Laravel Echo
- Listens to:
  - `orders` channel for admin notifications
  - `orders.{userId}` private channel for customer updates
- Returns: notifications array, unreadCount, handlers

**Context:** `resources/js/Context/NotificationContext.tsx`
- Global state management for notifications
- Provides: notifications, unreadCount, handlers to all components

**Components:**
- `NotificationBell.tsx` - Header icon with dropdown menu
- `NotificationToast.tsx` - Sonner toasts for new notifications

---

## How WebSocket Broadcasting Works

### Connection Flow:

```
1. Browser loads → resources/js/bootstrap.ts executes
   ↓
2. window.Echo = new Echo({ broadcaster: 'reverb', ... })
   ↓
3. Echo establishes WebSocket connection to ws://localhost:8080
   ↓
4. For private channels, sends auth token
   ↓
5. Reverb server validates and authorizes connection
   ↓
6. Browser subscribed to channels ('orders', 'orders.123')
```

### Broadcast Flow:

```
1. PHP code: OrderCreated::dispatchSync($order)
   ↓
2. Laravel serializes event and sends to Reverb server
   ↓
3. Reverb broadcasts to ALL connected clients on 'orders' channel
   ↓
4. Browser's Echo receives data via WebSocket
   ↓
5. JavaScript listener callback triggered
   ↓
6. React state updated
   ↓
7. Toast & notification bell re-render
```

### Private Channel Authorization:

```
1. Client: Echo.private('orders.123').listen(...)
   ↓
2. Client sends auth request to /broadcasting/auth endpoint
   ↓
3. Laravel middleware authorizes (checks if user_id matches)
   ↓
4. Server returns auth token
   ↓
5. Client sends token with subscription
   ↓
6. Reverb validates token and allows subscription
   ↓
7. Only user with ID 123 can receive broadcasts on this channel
```

---

## Troubleshooting

### Issue: Toast notifications not showing
- Check: Is Reverb server running? (Terminal 2)
- Check: Is browser console showing WebSocket errors?
- Check: Is auth user logged in?

### Issue: "WebSocket connection failed"
- Check: Port 8080 is not blocked by firewall
- Check: `.env` has correct REVERB_HOST and PORT
- Check: Reverb server is running: `php artisan reverb:start`

### Issue: Private channel subscribers can't see other users' notifications
- This is correct! Private channels (`orders.{user_id}`) are user-specific
- Each user only sees their own notifications (security feature)

### Issue: Admin not seeing notifications
- Check: Admin user role is set to "admin" in database
- Check: Check `app/Models/Observers/OrderObserver.php` targets admins correctly

### Issue: TypeError: window.Echo is undefined
- Check: bootstrap.ts imports are correct
- Check: laravel-echo and pusher-js are installed: `npm list laravel-echo pusher-js`
- Check: App.tsx is loading bootstrap.ts before using Echo

---

## Files Modified/Created

### Backend:
- ✅ `config/broadcasting.php` - Reverb configuration
- ✅ `.env` - BROADCAST_DRIVER=reverb + Reverb credentials
- ✅ `app/Events/OrderCreated.php` - Public broadcast event
- ✅ `app/Events/OrderStatusUpdated.php` - Private broadcast event
- ✅ `app/Notifications/OrderCreatedNotification.php` - Admin notification
- ✅ `app/Notifications/OrderStatusUpdateNotification.php` - Customer notification
- ✅ `app/Models/Observers/OrderObserver.php` - Model observer
- ✅ `app/Providers/AppServiceProvider.php` - Register observer

### Frontend:
- ✅ `resources/js/bootstrap.ts` - Echo initialization
- ✅ `resources/js/hooks/useRealtimeNotifications.ts` - Notification hook
- ✅ `resources/js/Context/NotificationContext.tsx` - State management
- ✅ `resources/js/Components/NotificationBell.tsx` - Bell icon component
- ✅ `resources/js/Components/NotificationToast.tsx` - Toast component
- ✅ `resources/js/Layouts/AppLayout.tsx` - Integrated providers + bell
- ✅ `resources/js/types/global.d.ts` - TypeScript declarations

### Packages:
- ✅ Composer: `laravel/reverb`
- ✅ NPM: `laravel-echo`, `pusher-js`

---

## Performance Considerations

### WebSocket vs HTTP Polling:
- **Polling:** 60+ requests/hour per user = high server load
- **WebSocket:** Persistent connection, event-driven = minimal overhead
- **Benefits:** Low latency (<100ms), scalable, real-time

### Database Notifications:
- Notifications stored in `notifications` table
- Allows history + "mark as read" functionality
- Customers can view notification history (optional feature)

### Queue System:
- `OrderCreatedNotification` is queued (ShouldQueue)
- Prevents request blocking
- Uses `database` queue driver (configured in queue.php)

---

## Next Steps (Optional Enhancements)

1. **Add Redis Queue** - Better than database queue for high volume
2. **Add Email Notifications** - Send email for order created
3. **Add SMS Notifications** - Integrate with Twilio
4. **Mark Notifications as Read** - Persist read status
5. **Notification Preferences** - Let users choose notification types
6. **Admin Notification Panel** - Full notification management page

---

## References

- [Laravel Reverb Documentation](https://laravel.com/docs/reverb)
- [Laravel Echo Documentation](https://laravel.com/docs/broadcasting)
- [WebSocket Protocol](https://en.wikipedia.org/wiki/WebSocket)

