#!/bin/bash
echo "=== Starting Deployment ==="

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

# 4. Copy backend PHP APIs and pages
echo "Copying backend PHP files and APIs..."
sudo cp /var/www/bus_pariwisata/api/discount.php /var/www/bus-pariwisata/api/discount.php
sudo cp /var/www/bus_pariwisata/api/buses.php /var/www/bus-pariwisata/api/buses.php
sudo cp /var/www/bus_pariwisata/admin/api/discount.php /var/www/bus-pariwisata/admin/api/discount.php
sudo cp /var/www/bus_pariwisata/admin/api/tambah_armada.php /var/www/bus-pariwisata/admin/api/tambah_armada.php
sudo cp /var/www/bus_pariwisata/admin/api/edit_armada.php /var/www/bus-pariwisata/admin/api/edit_armada.php
sudo cp /var/www/bus_pariwisata/admin/layout_header.php /var/www/bus-pariwisata/admin/layout_header.php
sudo cp /var/www/bus_pariwisata/admin/paket_wisata.php /var/www/bus-pariwisata/admin/paket_wisata.php

# 5. Delete removed backend PHP files from the live environment
echo "Removing legacy PHP API files..."
sudo rm -f /var/www/bus-pariwisata/api/paket_wisata.php
sudo rm -f /var/www/bus-pariwisata/admin/api/paket_wisata.php

# 6. Correct folder ownership and permissions
echo "Resetting permissions to www-data:www-data..."
sudo chown -R www-data:www-data /var/www/bus-pariwisata /var/www/bus-pariwisata-admin
sudo chmod -R 755 /var/www/bus-pariwisata /var/www/bus-pariwisata-admin

echo "=== Deployment Completed Successfully ==="
