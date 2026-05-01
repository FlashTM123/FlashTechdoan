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

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        \Filament\Support\Facades\FilamentView::registerRenderHook(
            'panels::body.end',
            fn (): \Illuminate\Support\HtmlString => new \Illuminate\Support\HtmlString('
                <style>
                    /* Chỉ áp dụng nền xám sáng khi KHÔNG phải dark mode */
                    html:not(.dark) .fi-main, 
                    html:not(.dark) .fi-sidebar { 
                        background-color: #f3f4f6 !important; 
                    }
                    
                    /* Tinh chỉnh bo góc và bóng cho Section */
                    .fi-section { 
                        border-radius: 1.25rem !important; 
                        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.05) !important; 
                        border: 1px solid rgb(0 0 0 / 0.05) !important;
                    }

                    .dark .fi-section {
                        border: 1px solid rgb(255 255 255 / 0.1) !important;
                        background-color: rgb(24 24 27) !important;
                    }

                    .fi-sidebar-footer { display: none !important; }
                </style>
            '),
        );

        return $panel
            ->default()
            ->id('admin')
            ->path('admin')
            ->login(\App\Filament\Pages\Auth\Login::class)
            ->colors([
                'primary' => Color::Amber,
            ])
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\Filament\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\Filament\Pages')
            ->pages([
                Dashboard::class,
            ])
            ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\Filament\Widgets')
            ->widgets([
                AccountWidget::class,
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
            ])
            ->widgets([
            StatsOverview::class,
            ProductByCategoryChart::class,
            LatestProducts::class,
            PendingReview::class,
        ]);
    }
}
