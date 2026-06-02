<?php

namespace App\Providers\Filament;

use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Pages\Dashboard;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Filament\Widgets\AccountWidget;
use Filament\Widgets\FilamentInfoWidget;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;
use App\Filament\Widgets\StatsOverview;
use App\Filament\Widgets\ProductByCategoryChart;
use App\Filament\Widgets\LatestProducts;
use App\Filament\Widgets\PendingReview;
use App\Filament\Widgets\RevenueWidget;
use App\Filament\Widgets\SalesChart;
use App\Filament\Widgets\TopSellingProducts;
use App\Filament\Widgets\RecentOrders;
use App\Filament\Resources\Coupons\CouponResource;
use App\Filament\Widgets\ClockWidget;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        \Filament\Support\Facades\FilamentView::registerRenderHook(
            'panels::body.end',
            fn (): \Illuminate\Support\HtmlString => new \Illuminate\Support\HtmlString('
                <style>
                    /* ═══════════════════════════════════════════════
                       FLASHTECH ADMIN — ULTIMATE PREMIUM UI
                    ═══════════════════════════════════════════════ */

                    /* Global Font rendering and smooth layout */
                    body {
                        font-feature-settings: "cv02", "cv03", "cv04", "cv11";
                        text-rendering: optimizeLegibility;
                        -webkit-font-smoothing: antialiased;
                    }

                    /* ── APP BRANDING & LOGO ───────────────────────────── */
                    .fi-logo {
                        font-weight: 900 !important;
                        letter-spacing: -0.03em !important;
                        background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                    }

                    /* ── STAT CARDS (DASHBOARD WIDGETS) ────────────────── */
                    .fi-wi-stats-overview-stat {
                        position: relative !important;
                        border-radius: 1.25rem !important;
                        border: 1px solid rgba(226, 232, 240, 0.8) !important;
                        background: rgba(255, 255, 255, 0.7) !important;
                        backdrop-filter: blur(12px) !important;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03) !important;
                        overflow: hidden !important;
                    }
                    .dark .fi-wi-stats-overview-stat {
                        border: 1px solid rgba(30, 41, 59, 0.7) !important;
                        background: rgba(15, 23, 42, 0.6) !important;
                        box-shadow: none !important;
                    }
                    .fi-wi-stats-overview-stat:hover {
                        transform: translateY(-4px) !important;
                        box-shadow: 0 20px 25px -5px rgba(99, 102, 241, 0.1), 0 10px 10px -5px rgba(99, 102, 241, 0.04) !important;
                        border-color: rgba(99, 102, 241, 0.4) !important;
                    }
                    .dark .fi-wi-stats-overview-stat:hover {
                        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4) !important;
                        border-color: rgba(99, 102, 241, 0.3) !important;
                    }

                    /* Bỏ viền cam mặc định */
                    .fi-wi-stats-overview-stat::before {
                        display: none !important;
                    }

                    /* ── STAT LABEL ────────────────────────────────────── */
                    .fi-wi-stats-overview-stat-label {
                        font-size: 0.75rem !important;
                        font-weight: 700 !important;
                        letter-spacing: 0.05em !important;
                        text-transform: uppercase !important;
                        color: #64748b !important;
                    }
                    .dark .fi-wi-stats-overview-stat-label {
                        color: #94a3b8 !important;
                    }

                    /* ── STAT VALUE ────────────────────────────────────── */
                    .fi-wi-stats-overview-stat-value {
                        font-size: 1.85rem !important;
                        font-weight: 900 !important;
                        line-height: 1.15 !important;
                        letter-spacing: -0.03em !important;
                        color: #1e293b !important;
                    }
                    .dark .fi-wi-stats-overview-stat-value {
                        color: #f8fafc !important;
                    }

                    /* ── SPARKLINE nhỏ gọn ─────────────────────────────── */
                    .fi-wi-stats-overview-stat-chart {
                        height: 52px !important;
                        opacity: 0.9 !important;
                    }

                    /* ── SECTIONS / CARDS ──────────────────────────────── */
                    .fi-section {
                        border-radius: 1.25rem !important;
                        border: 1px solid rgba(226, 232, 240, 0.8) !important;
                        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02) !important;
                        transition: all 0.3s ease !important;
                    }
                    .dark .fi-section {
                        border: 1px solid rgba(30, 41, 59, 0.7) !important;
                        box-shadow: none !important;
                    }
                    .fi-section:hover {
                        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05) !important;
                    }
                    .dark .fi-section:hover {
                        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3) !important;
                    }

                    /* ── TABLES ────────────────────────────────────────── */
                    .fi-ta-header-cell {
                        font-size: 0.7rem !important;
                        font-weight: 800 !important;
                        letter-spacing: 0.06em !important;
                        text-transform: uppercase !important;
                        color: #64748b !important;
                        background: #f8fafc !important;
                    }
                    .dark .fi-ta-header-cell {
                        color: #94a3b8 !important;
                        background: #0f172a !important;
                    }
                    .fi-ta-row {
                        transition: background-color 0.15s ease !important;
                    }
                    .fi-ta-row:hover {
                        background-color: rgba(99, 102, 241, 0.02) !important;
                    }
                    .dark .fi-ta-row:hover {
                        background-color: rgba(99, 102, 241, 0.03) !important;
                    }

                    /* ── SIDEBAR ───────────────────────────────────────── */
                    .fi-sidebar {
                        border-right: 1px solid rgba(226, 232, 240, 0.8) !important;
                        background: rgba(255, 255, 255, 0.95) !important;
                    }
                    .dark .fi-sidebar {
                        border-right: 1px solid rgba(30, 41, 59, 0.7) !important;
                        background: rgba(9, 15, 29, 0.95) !important;
                    }
                    .fi-sidebar-item-button {
                        border-radius: 0.75rem !important;
                        transition: all 0.2s ease !important;
                    }
                    .fi-sidebar-item-active {
                        background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%) !important;
                        color: #6366f1 !important;
                        font-weight: 700 !important;
                    }
                    .dark .fi-sidebar-item-active {
                        background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.1) 100%) !important;
                        color: #818cf8 !important;
                    }
                    .fi-sidebar-group-label {
                        font-size: 0.65rem !important;
                        letter-spacing: 0.1em !important;
                        text-transform: uppercase !important;
                        font-weight: 800 !important;
                        color: #94a3b8 !important;
                        margin-top: 1rem !important;
                    }

                    /* ── BUTTONS ───────────────────────────────────────── */
                    .fi-btn {
                        border-radius: 0.75rem !important;
                        font-weight: 700 !important;
                        letter-spacing: 0.01em !important;
                        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
                    }
                    .fi-btn:active {
                        transform: scale(0.96) !important;
                    }

                    /* ── INPUTS & SELECTS ──────────────────────────────── */
                    .fi-fo-text-input, .fi-fo-select, .fi-fo-textarea {
                        border-radius: 0.75rem !important;
                        transition: all 0.2s ease !important;
                    }
                    .fi-fo-text-input:focus-within, .fi-fo-select:focus-within {
                        border-color: #6366f1 !important;
                        box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15) !important;
                    }
                    .dark .fi-fo-text-input:focus-within, .dark .fi-fo-select:focus-within {
                        box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2) !important;
                    }

                    /* ── SIDEBAR COLLAPSE BUTTON AS FLOATING ROUNDED BUTTON ── */
                    .fi-sidebar-header {
                        position: relative !important;
                    }
                    /* Nút ẩn/hiện sidebar dạng hình tròn nổi trên vạch chia */
                    .fi-sidebar-header button {
                        position: absolute !important;
                        right: -14px !important;
                        top: 28px !important;
                        background: #ffffff !important;
                        border: 1px solid rgba(226, 232, 240, 0.9) !important;
                        box-shadow: 0 4px 10px rgba(0,0,0,0.06) !important;
                        border-radius: 9999px !important;
                        width: 28px !important;
                        height: 28px !important;
                        min-height: 28px !important;
                        min-width: 28px !important;
                        padding: 0 !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        color: #64748b !important;
                        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
                        z-index: 50 !important;
                    }
                    .dark .fi-sidebar-header button {
                        background: #1e293b !important;
                        border: 1px solid rgba(51, 65, 85, 0.9) !important;
                        box-shadow: 0 4px 10px rgba(0,0,0,0.4) !important;
                        color: #94a3b8 !important;
                    }
                    .fi-sidebar-header button:hover {
                        background: #6366f1 !important;
                        border-color: #6366f1 !important;
                        color: #ffffff !important;
                        transform: scale(1.1) !important;
                        box-shadow: 0 6px 14px rgba(99, 102, 241, 0.35) !important;
                    }
                    .fi-sidebar-header button svg {
                        width: 14px !important;
                        height: 14px !important;
                        transition: transform 0.2s ease !important;
                    }

                    /* Hide footer */
                    .fi-sidebar-footer { display: none !important; }
                </style>
            '),
        );

        \Filament\Support\Facades\FilamentView::registerRenderHook(
            \Filament\View\PanelsRenderHook::USER_MENU_BEFORE,
            fn (): \Illuminate\Contracts\View\View => view('filament.components.clock'),
        );

        return $panel
            ->default()
            ->id('admin')
            ->path('admin')
            ->brandName('FlashTech Hub')
            ->font('Outfit')
            ->sidebarCollapsibleOnDesktop() 
            // ->sidebarFullyCollapsibleOnDesktop() Cach 2: Cho phép thu gọn hoàn toàn sidebar trên desktop
            ->login(\App\Filament\Pages\Auth\Login::class)
            ->authGuard('admin')
            ->colors([
                'primary' => Color::Indigo,
                'gray' => Color::Slate,
            ])
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\Filament\Resources')
            ->resources([
                CouponResource::class,
            ])
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\Filament\Pages')
            ->pages([
                Dashboard::class,
            ])
            ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\Filament\Widgets')
            ->widgets([
                StatsOverview::class,
                RevenueWidget::class,
                SalesChart::class,
                ProductByCategoryChart::class,
                TopSellingProducts::class,
                RecentOrders::class,
                LatestProducts::class,
                PendingReview::class,
            ])
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                PreventRequestForgery::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([
                Authenticate::class,
            ]);
    }
}
