#!/bin/bash
# ==============================================================================
# setup_ssl.sh - Automated SSL Setup for mafinatrans.com & admin.mafinatrans.com
# ==============================================================================

SERVER_IP="20.214.162.119"
DOMAINS=("mafinatrans.com" "www.mafinatrans.com" "admin.mafinatrans.com")

echo "=== Verifying DNS Records for mafinatrans.com ==="
DNS_READY=true

for DOMAIN in "${DOMAINS[@]}"; do
    echo -n "Checking $DOMAIN... "
    RESOLVED_IP=$(dig +short "$DOMAIN" @8.8.8.8 | tail -n1)
    
    if [ -z "$RESOLVED_IP" ]; then
        echo "FAIL (No DNS record found)"
        DNS_READY=false
    elif [ "$RESOLVED_IP" != "$SERVER_IP" ]; then
        echo "FAIL (Points to $RESOLVED_IP, should point to $SERVER_IP)"
        DNS_READY=false
    else
        echo "OK (Points to $SERVER_IP)"
    fi
done

if [ "$DNS_READY" = false ]; then
    echo ""
    echo "⚠️  WARNING: DNS verification failed!"
    echo "Please ensure that the DNS A records for all domains point to $SERVER_IP."
    echo "DNS propagation can take up to 24-48 hours after DNS records are updated."
    echo "Run this script again once DNS setup is complete."
    exit 1
fi

echo ""
echo "=== DNS Checked. Requesting Let's Encrypt SSL Certificates ==="

# 1. Generate SSL Certificate for Main Website
echo "Obtaining SSL certificate for mafinatrans.com & www.mafinatrans.com..."
sudo certbot certonly --nginx --agree-tos --register-unsafely-without-email -d mafinatrans.com -d www.mafinatrans.com
if [ $? -ne 0 ]; then
    echo "ERROR: Certbot failed to obtain certificate for mafinatrans.com."
    exit 1
fi

# 2. Generate SSL Certificate for Admin Panel
echo "Obtaining SSL certificate for admin.mafinatrans.com..."
sudo certbot certonly --nginx --agree-tos --register-unsafely-without-email -d admin.mafinatrans.com
if [ $? -ne 0 ]; then
    echo "ERROR: Certbot failed to obtain certificate for admin.mafinatrans.com."
    exit 1
fi

echo ""
echo "=== Updating Nginx configurations in workspace ==="

# 3. Update main website nginx_config with new certificate paths
echo "Updating nginx_config..."
sed -i 's|/etc/letsencrypt/live/mafinatrans2.duckdns.org/|/etc/letsencrypt/live/mafinatrans.com/|g' nginx_config

# 4. Update admin panel nginx_config_admin to support HTTPS
echo "Updating nginx_config_admin..."
cat << 'EOF' > nginx_config_admin
server {
    listen 443 ssl;
    server_name admin.mafinatrans.com;
    root /var/www/bus-pariwisata-admin;
    index index.html index.htm;

    ssl_certificate /etc/letsencrypt/live/admin.mafinatrans.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/admin.mafinatrans.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # HTTP Security Headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
    add_header Content-Security-Policy "default-src 'self' https: http: 'unsafe-inline' 'unsafe-eval' data:; img-src 'self' data: https: http:; font-src 'self' https: http: data:; connect-src 'self' https: http:;" always;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Deny access to sensitive files
    location ~* \.(env|sql|bak|zip|git|gitignore|htaccess|config)$ {
        deny all;
        return 404;
    }
}

server {
    listen 80;
    server_name admin.mafinatrans.com;
    return 301 https://$host$request_uri;
}
EOF

# 5. Run the deployment script to copy config and reload Nginx
echo "Deploying changes and reloading Nginx..."
chmod +x deploy.sh
./deploy.sh

echo ""
echo "=== SSL setup completed successfully! ==="
echo "Main website: https://mafinatrans.com"
echo "Admin panel:  https://admin.mafinatrans.com"
