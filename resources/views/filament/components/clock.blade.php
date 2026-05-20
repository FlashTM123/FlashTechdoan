<div
    x-data="{
        time: '',
        date: '',
        init() {
            this.tick();
            setInterval(() => this.tick(), 1000);
        },
        tick() {
            const now = new Date();
            this.time = now.toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });
            this.date = now.toLocaleDateString('vi-VN', {
                weekday: 'short',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        }
    }"
    style="display: flex; align-items: center; gap: 10px; padding: 4px 12px; margin-right: 8px; border-radius: 8px; background: rgba(120, 120, 120, 0.08); border: 1px solid rgba(120, 120, 120, 0.15);"
>
    <!-- Icon -->
    <svg style="width: 20px; height: 20px; color: #f59e0b;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>

    <!-- Text -->
    <div style="display: flex; flex-direction: column; justify-content: center;">
        <span
            x-text="time"
            style="font-size: 0.85rem; font-weight: 700; letter-spacing: -0.01em; line-height: 1.2; font-variant-numeric: tabular-nums;"
            class="fi-topbar-clock-time"
        ></span>
        <span
            x-text="date"
            style="font-size: 0.65rem; font-weight: 500; color: #82828b; line-height: 1.1; text-transform: capitalize;"
        ></span>
    </div>
</div>

<style>
    /* Kế thừa màu chữ của topbar (hỗ trợ cả dark/light mode) */
    .fi-topbar-clock-time {
        color: inherit;
    }
    .dark .fi-topbar-clock-time {
        color: #f4f4f5;
    }
</style>
