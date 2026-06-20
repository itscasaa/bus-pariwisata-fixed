#!/bin/bash
echo "=== Starting Production Deployment & Hardening ==="

# 1. Clean up old bundles and webp files in the public website directory
echo "Cleaning up old bundle and webp files..."
sudo rm -f /var/www/bus-pariwisata/bundle.*
sudo rm -f /var/www/bus-pariwisata/*.webp

# 2. Copy the compiled public frontend files
echo "Copying compiled public frontend..."
sudo cp -r /var/www/bus_pariwisata/frontend/dist/* /var/www/bus-pariwisata/

# 3. Clean and copy the compiled admin-panel files
echo "Copying compiled admin-panel..."
sudo rm -rf /var/www/bus-pariwisata-admin/*
sudo cp -r /var/www/bus_pariwisata/admin-panel/dist/* /var/www/bus-pariwisata-admin/

# 4. Copy backend PHP APIs, config, and rate limiter files recursively
echo "Copying backend PHP files and APIs..."
sudo mkdir -p /var/www/bus-pariwisata/api
sudo mkdir -p /var/www/bus-pariwisata/admin/api
sudo mkdir -p /var/www/bus-pariwisata/config
sudo mkdir -p /var/www/bus-pariwisata/images
sudo cp -r /var/www/bus_pariwisata/api/* /var/www/bus-pariwisata/api/
sudo cp -r /var/www/bus_pariwisata/admin/* /var/www/bus-pariwisata/admin/
sudo cp -r /var/www/bus_pariwisata/config/* /var/www/bus-pariwisata/config/

# 5. Copy root and images .htaccess files for Apache hardening
echo "Deploying Apache .htaccess protection files..."
sudo cp /var/www/bus_pariwisata/.htaccess /var/www/bus-pariwisata/.htaccess
sudo cp /var/www/bus_pariwisata/images/.htaccess /var/www/bus-pariwisata/images/.htaccess

# 6. Copy Nginx virtual hosts configurations
echo "Deploying Nginx hardened virtual host configurations..."
sudo cp /var/www/bus_pariwisata/nginx_config /etc/nginx/sites-available/bus-pariwisata
sudo cp /var/www/bus_pariwisata/nginx_config_admin /etc/nginx/sites-available/bus-pariwisata-admin

# 7. Delete removed backend PHP, debug, and SQL backup files from live server
echo "Cleaning up debug and backup files on the production server..."
sudo rm -f /var/www/bus-pariwisata/api/paket_wisata.php
sudo rm -f /var/www/bus-pariwisata/admin/api/paket_wisata.php
sudo rm -f /var/www/bus-pariwisata/api/buses_debug.php
sudo rm -f /var/www/bus-pariwisata/api/price_list_debug.php
sudo rm -f /var/www/bus-pariwisata/admin/api/test_info.php
sudo rm -f /var/www/bus-pariwisata/config/suryatourtrans.sql

# 8. Correct folder ownership and permissions
echo "Resetting permissions to www-data:www-data..."
sudo chown -R www-data:www-data /var/www/bus-pariwisata /var/www/bus-pariwisata-admin
sudo chmod -R 755 /var/www/bus-pariwisata /var/www/bus-pariwisata-admin
# Make uploaded images directory writable but non-executable (enforced by Nginx/htaccess rules)
sudo chmod -R 777 /var/www/bus-pariwisata/images

# 9. Reload Nginx server to apply new configurations
echo "Reloading Nginx service..."
sudo systemctl reload nginx

echo "=== Production Deployment & Hardening Completed ==="
