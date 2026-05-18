#!/bin/bash
cd /var/www/html
composer install --no-dev --optimize-autoloader
php artisan key:generate --force
php artisan migrate --force
php artisan db:seed --force 2>/dev/null || true
php artisan config:cache
php artisan route:cache
apache2-foreground
