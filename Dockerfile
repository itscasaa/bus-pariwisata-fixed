# Stage 1: Build the React applications (Frontend and Admin Panel)
FROM node:20-alpine AS build-stage
WORKDIR /app

# Copy the entire project
COPY . .

# Build React frontend
WORKDIR /app/frontend
RUN npm install
RUN npm run build

# Build React admin panel
WORKDIR /app/admin-panel
RUN npm install
RUN npm run build

# Stage 2: Final runner image with PHP-FPM, Nginx, and Supervisor
FROM php:8.1-fpm
WORKDIR /app

# Install Nginx, Supervisor, and PostgreSQL driver libraries
RUN apt-get update && apt-get install -y \
    nginx \
    supervisor \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql \
    && rm -rf /var/lib/apt/lists/*

# Copy configuration files
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Setup web roots
RUN mkdir -p /var/www/bus-pariwisata /var/www/bus-pariwisata-admin

# Copy static assets compiled in build stage
COPY --from=build-stage /app/frontend/dist /var/www/bus-pariwisata
COPY --from=build-stage /app/admin-panel/dist /var/www/bus-pariwisata-admin

# Copy backend PHP files, config, and images
COPY api /var/www/bus-pariwisata/api
COPY admin /var/www/bus-pariwisata/admin
COPY config /var/www/bus-pariwisata/config
COPY images /var/www/bus-pariwisata/images

# ALSO copy static frontend images from frontend/public/images to the shared /images directory
COPY frontend/public/images /var/www/bus-pariwisata/images/

# Correct ownership and permissions
RUN chown -R www-data:www-data /var/www/bus-pariwisata /var/www/bus-pariwisata-admin

EXPOSE 8080 8081

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
