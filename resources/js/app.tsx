import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

import { CartProvider } from './Context/CartContext';
import { CompareProvider } from './Context/CompareContext';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/build/sw.js', { scope: '/' });
    });
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: async (name) => {
        const page: any = await resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        );
        const Page = page.default;
        const WrappedPage = (props: any) => (
            <CompareProvider>
                <CartProvider>
                    <Page {...props} />
                </CartProvider>
            </CompareProvider>
        );
        WrappedPage.layout = Page.layout; // Giữ lại layout nếu có

        return {
            ...page,
            default: WrappedPage,
        };
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
