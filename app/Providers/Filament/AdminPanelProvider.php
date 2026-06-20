<?php

namespace App\Providers\Filament;

use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use App\Filament\Pages\Dashboard;
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
use App\Filament\Widgets\LowStockProducts;
use App\Filament\Widgets\OrderStatusDistribution;
use App\Filament\Resources\Coupons\CouponResource;
use App\Filament\Widgets\ClockWidget;

// KHAI BÁO THÊM 2 DÒNG NÀY ĐỂ GỌI ĐÚNG ĐƯỜNG DẪN FILE RESOURCE CỦA MINH
use App\Filament\Resources\Suppliers\SupplierResource;
use App\Filament\Resources\StockImports\StockImportResource;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        \Filament\Support\Facades\FilamentView::registerRenderHook(
            'panels::body.end',
            fn (): \Illuminate\Support\HtmlString => new \Illuminate\Support\HtmlString('
                <style>
                    /* Custom Scrollbar */
                    ::-webkit-scrollbar {
                        width: 6px;
                        height: 6px;
                    }
                    ::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    ::-webkit-scrollbar-thumb {
                        background: rgba(156, 163, 175, 0.3);
                        border-radius: 9999px;
                    }
                    ::-webkit-scrollbar-thumb:hover {
                        background: rgba(156, 163, 175, 0.5);
                    }

                    /* Fix Chrome Auto-fill yellow background color */
                    input:-webkit-autofill,
                    input:-webkit-autofill:hover, 
                    input:-webkit-autofill:focus, 
                    input:-webkit-autofill:active {
                        -webkit-background-clip: text !important;
                        transition: background-color 5000000s ease-in-out 0s !important;
                    }
                    .dark input:-webkit-autofill,
                    .dark input:-webkit-autofill:hover, 
                    .dark input:-webkit-autofill:focus, 
                    .dark input:-webkit-autofill:active {
                        -webkit-text-fill-color: #f8fafc !important;
                    }
                    input:-webkit-autofill,
                    input:-webkit-autofill:hover, 
                    input:-webkit-autofill:focus, 
                    input:-webkit-autofill:active {
                        -webkit-text-fill-color: #0f172a !important;
                    }

                    /* Smooth interactions & hover states */
                    .fi-sidebar-item {
                        transition: all 0.2s ease-in-out;
                    }
                    .fi-sidebar-item:hover {
                        transform: translateX(4px);
                    }
                    
                    /* Modern premium glassmorphism for Sidebar & Topbar */
                    .fi-sidebar {
                        background: rgba(248, 250, 252, 0.3) !important;
                        backdrop-filter: blur(12px);
                        border-right: 1px solid rgba(226, 232, 240, 0.8) !important;
                    }
                    .dark .fi-sidebar {
                        background: rgba(15, 23, 42, 0.3) !important;
                        backdrop-filter: blur(12px);
                        border-right: 1px solid rgba(30, 41, 59, 0.8) !important;
                    }
                    
                    .fi-topbar {
                        background: rgba(255, 255, 255, 0.4) !important;
                        backdrop-filter: blur(16px);
                        border-bottom: 1px solid rgba(226, 232, 240, 0.8) !important;
                    }
                    .dark .fi-topbar {
                        background: rgba(15, 23, 42, 0.4) !important;
                        backdrop-filter: blur(16px);
                        border-bottom: 1px solid rgba(30, 41, 59, 0.8) !important;
                    }

                    /* Cards & Widgets premium styling */
                    .fi-wi-stats-overview-stat-card {
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        border: 1px solid rgba(226, 232, 240, 0.8) !important;
                        border-radius: 16px !important;
                        overflow: hidden;
                    }
                    .dark .fi-wi-stats-overview-stat-card {
                        border: 1px solid rgba(30, 41, 59, 0.8) !important;
                    }
                    .fi-wi-stats-overview-stat-card:hover {
                        transform: translateY(-4px);
                        box-shadow: 0 12px 20px -8px rgba(99, 102, 241, 0.15) !important;
                        border-color: rgba(99, 102, 241, 0.4) !important;
                    }
                    
                    /* Form input premium states */
                    .fi-fo-text-input input, .fi-fo-select select, .fi-fo-textarea textarea {
                        border-radius: 10px !important;
                        transition: all 0.2s ease;
                    }
                    .fi-fo-text-input input:focus, .fi-fo-select select:focus, .fi-fo-textarea textarea:focus {
                        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15) !important;
                    }

                    /* Header description styling */
                    .fi-header-heading {
                        letter-spacing: -0.02em;
                        font-weight: 800;
                    }

                    /* Premium Login Page Styling */
                    .fi-simple-layout {
                        background: radial-gradient(circle at 50% 50%, #1e1b4b 0%, #09090b 100%) !important;
                        min-height: 100vh;
                        position: relative;
                        overflow: hidden;
                    }
                    .fi-simple-layout::before {
                        content: "";
                        position: absolute;
                        width: 400px;
                        height: 400px;
                        background: radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%);
                        top: 20%;
                        left: 10%;
                        z-index: 0;
                        pointer-events: none;
                    }
                    .fi-simple-layout::after {
                        content: "";
                        position: absolute;
                        width: 500px;
                        height: 500px;
                        background: radial-gradient(circle, rgba(245, 158, 11, 0.06) 0%, transparent 70%);
                        bottom: 10%;
                        right: 5%;
                        z-index: 0;
                        pointer-events: none;
                    }
                    .fi-simple-card {
                        background: rgba(15, 23, 42, 0.65) !important;
                        backdrop-filter: blur(16px);
                        border: 1px solid rgba(255, 255, 255, 0.08) !important;
                        box-shadow: 0 20px 45px -15px rgba(0, 0, 0, 0.6) !important;
                        border-radius: 20px !important;
                        z-index: 10;
                    }
                    .fi-simple-card input {
                        background: rgba(30, 41, 59, 0.5) !important;
                        border: 1px solid rgba(255, 255, 255, 0.1) !important;
                        color: #ffffff !important;
                        border-radius: 12px !important;
                        transition: all 0.2s ease-in-out;
                    }
                    .fi-simple-card input:focus {
                        border-color: #6366f1 !important;
                        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25) !important;
                    }
                    .fi-simple-card button[type="submit"] {
                        background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%) !important;
                        border: none !important;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        font-weight: 700 !important;
                        border-radius: 12px !important;
                        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3) !important;
                        color: #ffffff !important;
                    }
                    .fi-simple-card button[type="submit"]:hover {
                        transform: translateY(-1px);
                        box-shadow: 0 6px 18px rgba(99, 102, 241, 0.5) !important;
                    }

                    /* Validation error message premium styling */
                    .fi-fo-field-wrp-error-message {
                        color: #dc2626 !important;
                        font-size: 0.775rem !important;
                        font-weight: 600 !important;
                        display: inline-flex !important;
                        align-items: center !important;
                        gap: 6px !important;
                        margin-top: 6px !important;
                        padding: 6px 10px !important;
                        background: rgba(239, 68, 68, 0.08) !important;
                        border: 1px solid rgba(239, 68, 68, 0.15) !important;
                        border-radius: 8px !important;
                        animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
                    }
                    .dark .fi-fo-field-wrp-error-message {
                        color: #f87171 !important;
                        background: rgba(239, 68, 68, 0.12) !important;
                        border-color: rgba(239, 68, 68, 0.25) !important;
                    }
                    .fi-fo-field-wrp-error-message::before {
                        content: "⚠️";
                        display: inline-block;
                        font-size: 0.85rem;
                        filter: drop-shadow(0 0 2px rgba(239, 68, 68, 0.3));
                    }

                    /* Glow effect for invalid input fields */
                    .fi-fo-text-input input[aria-invalid="true"],
                    .fi-simple-card input[aria-invalid="true"] {
                        border-color: rgba(239, 68, 68, 0.5) !important;
                        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2) !important;
                    }
                    
                    /* Shake animation for input errors */
                    @keyframes shake {
                        10%, 90% { transform: translate3d(-1px, 0, 0); }
                        20%, 80% { transform: translate3d(2px, 0, 0); }
                        30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
                        40%, 60% { transform: translate3d(4px, 0, 0); }
                    }
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
            ->font('Be Vietnam Pro')
            ->sidebarCollapsibleOnDesktop()
            ->login(\App\Filament\Pages\Auth\Login::class)
            ->authGuard('admin')
            ->colors([
                'primary' => Color::Indigo,
                'gray' => Color::Slate,
            ])
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\\Filament\\Resources')

            // ĐĂNG KÝ CỐ ĐỊNH TẠI ĐÂY ĐỂ V5 ÉP HIỂN THỊ LÊN MENU SIDEBAR
            ->resources([
                CouponResource::class,
                SupplierResource::class,    // <--- Thêm ông này
                StockImportResource::class, // <--- Thêm ông này
            ])

            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\\Filament\\Pages')
            ->pages([
                Dashboard::class,
            ])
            ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\\Filament\\Widgets')
            ->widgets([
                StatsOverview::class,
                RevenueWidget::class,
                SalesChart::class,
                OrderStatusDistribution::class,
                ProductByCategoryChart::class,
                TopSellingProducts::class,
                LowStockProducts::class,
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
