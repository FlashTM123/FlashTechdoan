# ─────────────────────────────────────────────────────────────
# Stage 1: Build frontend assets (Node)
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS frontend

WORKDIR /app

# Cài pnpm (project dùng pnpm-lock.yaml)
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

# ─────────────────────────────────────────────────────────────
# Stage 2: PHP production image
# ─────────────────────────────────────────────────────────────
FROM php:8.3-fpm-alpine AS app

# Cài dependencies hệ thống
RUN apk add --no-cache \
    nginx \
    curl \
    libpng-dev \
    libjpeg-turbo-dev \
    libwebp-dev \
    freetype-dev \
    zip \
    unzip \
    git \
    oniguruma-dev \
    libzip-dev \
    icu-dev \
    supervisor \
    libxml2-dev \
    libsodium-dev \
    linux-headers \
    autoconf \
    g++ \
    make

# Cài PHP extensions chuẩn
RUN docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
 && docker-php-ext-install -j$(nproc) \
    pdo_mysql \
    mbstring \
    zip \
    gd \
    bcmath \
    intl \
    opcache \
    fileinfo \
    xml \
    dom \
    simplexml \
    sodium \
    pcntl \
    exif

# Cài MongoDB extension qua PECL (cần cho mongodb/laravel-mongodb)
RUN pecl install mongodb \
 && docker-php-ext-enable mongodb

# Dọn build tools sau khi cài xong (giảm image size)
RUN apk del autoconf g++ make linux-headers

# Cài Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy toàn bộ source
COPY . .

# Copy frontend assets từ stage 1
COPY --from=frontend /app/public/build ./public/build

# Cài PHP dependencies (không chạy scripts vì cần DB — sẽ chạy trong entrypoint)
RUN composer install \
    --no-dev \
    --optimize-autoloader \
    --no-interaction \
    --no-progress \
    --no-scripts

# Phân quyền storage
RUN mkdir -p storage/framework/{sessions,views,cache} \
    && mkdir -p storage/logs \
    && mkdir -p bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Nginx config
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Supervisor config (chạy nginx + php-fpm cùng lúc)
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# PHP opcache config
COPY docker/opcache.ini /usr/local/etc/php/conf.d/opcache.ini

EXPOSE 80

# Entrypoint: chạy migrations + cache rồi start services
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
