#!/bin/bash
set -e

cd /var/www/html

composer install --no-dev --optimize-autoloader

if [ -n "$DB_SSL_CA" ]; then
  mkdir -p /var/www/html/storage/certs
  printf "%b" "$DB_SSL_CA" > /var/www/html/storage/certs/aiven-ca.pem
  chmod 600 /var/www/html/storage/certs/aiven-ca.pem
fi

php artisan config:clear
php artisan cache:clear

php artisan migrate --force
php artisan db:seed --force || true

php artisan config:cache
php artisan route:cache
php artisan view:cache

apache2-foreground
