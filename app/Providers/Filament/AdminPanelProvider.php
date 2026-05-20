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
                       FLASHTECH ADMIN — CLEAN PROFESSIONAL UI
                    ═══════════════════════════════════════════════ */

                    /* ── STAT CARD ─────────────────────────────────────── */
                    .fi-wi-stats-overview-stat {
                        position: relative !important;
                        border-radius: 0.875rem !important;
                        overflow: hidden !important;
                        transition: transform 0.18s ease, box-shadow 0.18s ease !important;
                    }
                    .fi-wi-stats-overview-stat:hover {
                        transform: translateY(-2px) !important;
                        box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important;
                    }
                    .dark .fi-wi-stats-overview-stat:hover {
                        box-shadow: 0 8px 32px rgba(0,0,0,0.4) !important;
                    }

                    /* Bỏ ::before (đường viền cam xấu) */
                    .fi-wi-stats-overview-stat::before {
                        display: none !important;
                    }

                    /* ── STAT LABEL — bình thường, không uppercase ──────── */
                    .fi-wi-stats-overview-stat-label {
                        font-size: 0.8rem !important;
                        font-weight: 600 !important;
                        letter-spacing: 0.01em !important;
                        text-transform: none !important;
                    }

                    /* ── STAT VALUE — vừa đủ, không bị xuống dòng ────── */
                    .fi-wi-stats-overview-stat-value {
                        font-size: 1.65rem !important;
                        font-weight: 800 !important;
                        line-height: 1.15 !important;
                        letter-spacing: -0.015em !important;
                        white-space: nowrap !important;
                        overflow: hidden !important;
                        text-overflow: ellipsis !important;
                    }

                    /* ── STAT DESCRIPTION ──────────────────────────────── */
                    .fi-wi-stats-overview-stat-description {
                        font-size: 0.775rem !important;
                        font-weight: 500 !important;
                        margin-top: 0.25rem !important;
                    }

                    /* ── SPARKLINE nhỏ gọn ─────────────────────────────── */
                    .fi-wi-stats-overview-stat-chart {
                        height: 48px !important;
                        opacity: 0.85 !important;
                    }

                    /* ── SECTION / CARD wrapper ────────────────────────── */
                    .fi-section {
                        border-radius: 0.875rem !important;
                        transition: box-shadow 0.18s ease !important;
                    }
                    .fi-section:hover {
                        box-shadow: 0 6px 18px rgba(0,0,0,0.09) !important;
                    }
                    .dark .fi-section:hover {
                        box-shadow: 0 6px 24px rgba(0,0,0,0.35) !important;
                    }

                    /* ── TABLE header ──────────────────────────────────── */
                    .fi-ta-header-cell {
                        font-size: 0.72rem !important;
                        font-weight: 700 !important;
                        letter-spacing: 0.04em !important;
                        text-transform: uppercase !important;
                    }

                    /* ── BADGE ─────────────────────────────────────────── */
                    .fi-badge {
                        border-radius: 9999px !important;
                        font-weight: 600 !important;
                        font-size: 0.7rem !important;
                        padding: 0.15rem 0.6rem !important;
                    }

                    /* ── SIDEBAR ───────────────────────────────────────── */
                    .fi-sidebar-item-button {
                        border-radius: 0.5rem !important;
                    }
                    .fi-sidebar-group-label {
                        font-size: 0.68rem !important;
                        letter-spacing: 0.08em !important;
                        text-transform: uppercase !important;
                        font-weight: 700 !important;
                    }

                    /* Ẩn footer Filament */
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
            ->brandName('FlashTech')
            ->login(\App\Filament\Pages\Auth\Login::class)
            ->authGuard('admin')
            ->colors([
                'primary' => Color::Amber,
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
