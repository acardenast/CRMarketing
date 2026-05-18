FROM php:8.4-apache

# Dependencias del sistema
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    curl \
  && docker-php-ext-install pdo_mysql zip mbstring exif pcntl bcmath \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

# Composer desde imagen oficial
COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

# Apuntar DocumentRoot a /public y activar AllowOverride All
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' \
      /etc/apache2/sites-available/*.conf \
 && sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' \
      /etc/apache2/apache2.conf \
      /etc/apache2/conf-available/*.conf \
 && sed -i 's/AllowOverride None/AllowOverride All/g' \
      /etc/apache2/apache2.conf \
      /etc/apache2/conf-available/*.conf \
      /etc/apache2/sites-available/*.conf

# mod_rewrite
RUN a2enmod rewrite

RUN a2dismod mpm_event && a2enmod mpm_prefork

COPY . .

RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

WORKDIR /var/www/html

EXPOSE 80

CMD ["/bin/bash", "/var/www/html/start.sh"]
