#!/bin/sh
set -e

echo "==> Starting FlashTech production entrypoint..."

# Tạo .env từ biến môi trường Render nếu chưa có
if [ ! -f /var/www/html/.env ]; then
    echo "==> .env not found, copying from .env.example"
    cp /var/www/html/.env.example /var/www/html/.env
fi

cd /var/www/html

# Generate APP_KEY nếu chưa có
if ! grep -q "^APP_KEY=base64:" .env 2>/dev/null; then
    echo "==> Generating APP_KEY..."
    php artisan key:generate --force
fi

# Clear & cache config để dùng biến môi trường từ Render
echo "==> Caching config, routes, views..."
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Chạy migrations
echo "==> Running database migrations..."
php artisan migrate --force

# Link storage
echo "==> Linking storage..."
php artisan storage:link || true

# Fix permissions
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

echo "==> Starting supervisor (nginx + php-fpm)..."
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
