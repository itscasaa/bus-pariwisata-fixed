import { test, expect } from '@playwright/test';
import { loginAndGetToken } from '../helpers/admin-auth';

test.describe('API - Production Hardening Security Audit', () => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  let validToken: string;

  test.beforeAll(async ({ request }) => {
    // Obtain valid token for file upload testing
    validToken = await loginAndGetToken(request, baseUrl);
  });

  // 1. Upload rejects PHP file
  test('POST /admin/api/tambah_armada.php - should reject PHP file upload', async ({ request }) => {
    const fileContent = '<?php echo "evil payload"; ?>';
    const response = await request.post(`${baseUrl}/admin/api/tambah_armada.php`, {
      headers: {
        'Authorization': `Bearer ${validToken}`
      },
      multipart: {
        nama_bus: 'Test Bus Malicious',
        kapasitas: '40',
        harga_sewa: '3000000',
        gambar_file: {
          name: 'shell.php',
          mimeType: 'application/x-php',
          buffer: Buffer.from(fileContent)
        }
      }
    });

    // It should return 200 with status error from sendResponse
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.status).toBe('error');
    expect(body.message).toMatch(/Ekstensi|Tipe file tidak valid/i);
  });

  // 2. Upload rejects SVG file
  test('POST /admin/api/tambah_armada.php - should reject SVG file upload', async ({ request }) => {
    const fileContent = '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>';
    const response = await request.post(`${baseUrl}/admin/api/tambah_armada.php`, {
      headers: {
        'Authorization': `Bearer ${validToken}`
      },
      multipart: {
        nama_bus: 'Test Bus SVG XSS',
        kapasitas: '45',
        harga_sewa: '4000000',
        gambar_file: {
          name: 'exploit.svg',
          mimeType: 'image/svg+xml',
          buffer: Buffer.from(fileContent)
        }
      }
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.status).toBe('error');
    expect(body.message).toMatch(/Ekstensi|Tipe file tidak valid/i);
  });

  // 3. Admin login rate limit works
  test('POST /admin/api/login.php - should trigger rate limiting (HTTP 429) on excessive attempts', async ({ request }) => {
    // Hit login endpoint 6 times in rapid succession. The 6th should be blocked by our rate limit (5 limit, 60s window).
    let lastStatus = 200;
    let rateLimited = false;

    for (let i = 0; i < 7; i++) {
      const res = await request.post(`${baseUrl}/admin/api/login.php`, {
        headers: {
          'X-Test-Bypass': 'none' // Disable the bypass header to test rate limits
        },
        data: {
          username: 'admin',
          password: 'wrong_password_to_avoid_success_session_reset'
        }
      });
      lastStatus = res.status();
      if (lastStatus === 429) {
        rateLimited = true;
        const body = await res.json();
        expect(body.message).toMatch(/Too many requests/i);
        break;
      }
    }

    expect(rateLimited).toBe(true);
  });

  // 4. Config and database files are not publicly readable (return 404/403)
  const sensitiveFiles = [
    '/config/koneksi.php',
    '/config/suryatourtrans.sql',
    '/database/setup.sql',
    '/.env'
  ];

  for (const path of sensitiveFiles) {
    test(`GET ${path} - should be blocked and return 404 or 403`, async ({ request }) => {
      const response = await request.get(`${baseUrl}${path}`);
      expect(response.status()).toBeGreaterThanOrEqual(403);
      expect(response.status()).toBeLessThanOrEqual(404);
    });
  }

  // 5. Debug endpoints return 404
  const debugEndpoints = [
    '/api/buses_debug.php',
    '/api/price_list_debug.php',
    '/admin/api/test_info.php'
  ];

  for (const path of debugEndpoints) {
    test(`GET ${path} - should return 404 Not Found`, async ({ request }) => {
      const response = await request.get(`${baseUrl}${path}`);
      expect(response.status()).toBe(404);
    });
  }

  // 6. Wrong HTTP method returns 405 Method Not Allowed
  const methodMismatches = [
    { path: '/admin/api/login.php', method: 'GET' },
    { path: '/api/contact.php', method: 'GET' },
    { path: '/api/booking.php', method: 'GET' },
    { path: '/api/buses.php', method: 'POST' }
  ];

  for (const mismatch of methodMismatches) {
    test(`${mismatch.method} ${mismatch.path} - should reject with HTTP 405 Method Not Allowed`, async ({ request }) => {
      const response = await request.fetch(`${baseUrl}${mismatch.path}`, {
        method: mismatch.method
      });
      expect(response.status()).toBe(405);
      const body = await response.json();
      expect(body.message).toMatch(/method|metode/i);
    });
  }

  // 7. Public endpoints still work perfectly
  test('GET /api/buses.php - should remain publicly accessible', async ({ request }) => {
    const response = await request.get(`${baseUrl}/api/buses.php`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.status).toBe('success');
  });

  // 8. No raw database/PHP errors exposed on bad parameters
  test('GET /api/price_list.php - bad query parameters should not leak DB structures', async ({ request }) => {
    const response = await request.get(`${baseUrl}/api/price_list.php?keyword=' OR 1=1 --`);
    const text = await response.text();
    expect(text).not.toContain('mysqli');
    expect(text).not.toContain('SQL syntax');
    expect(text).not.toContain('Warning:');
  });
});
