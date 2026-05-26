#!/bin/bash
set -e

cd /var/www/html

composer install --no-dev --optimize-autoloader

chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

php artisan optimize:clear || true
php artisan config:clear || true
php artisan cache:clear || true

php artisan migrate --force || true

php artisan config:cache
php artisan route:cache
php artisan view:cache

apache2-foreground
