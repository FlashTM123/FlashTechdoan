import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.tsx',
            refresh: true,
        }),
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            outDir: 'public/build',
            buildBase: '/build/',
            scope: '/',
            base: '/',
            manifest: {
                name: 'FlashTech E-Commerce',
                short_name: 'FlashTech',
                description: 'Hệ thống thương mại điện tử FlashTech - Đồ công nghệ cao cấp',
                theme_color: '#4f46e5',
                background_color: '#ffffff',
                display: 'standalone',
                start_url: '/',
                scope: '/',
                icons: [
                    {
                        src: '/pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: '/pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable'
                    }
                ]
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff,woff2}'],
                navigateFallback: null,
            },
            devOptions: {
                enabled: false, // Tắt SW trong môi trường dev/local để tránh cache cũ
            },
        })
    ],

    // Tối ưu dev mode - cấu hình cho Docker
    server: {
        host: '0.0.0.0',
        port: 5173,
        origin: 'http://127.0.0.1:5173',
        cors: true,
        watch: {
            usePolling: true,
            ignored: ['**/node_modules/**', '**/.git/**'],
        },
    },
});
