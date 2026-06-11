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
                    /* ... Giữ nguyên toàn bộ đống CSS Premium UI xịn sò của Minh ở đây ... */
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
