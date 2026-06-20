import { test, expect } from '@playwright/test';
import { loginAndGetToken, generateFakeToken, generateExpiredToken } from '../helpers/admin-auth';

test.describe('API - Admin Endpoints Security & Protection', () => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  let validToken: string;

  test.beforeAll(async ({ request }) => {
    // Acquire a valid admin token before running the suite
    validToken = await loginAndGetToken(request, baseUrl);
  });

  const adminEndpoints = [
    { name: 'Tambah Armada', path: '/admin/api/tambah_armada.php', method: 'POST' },
    { name: 'Edit Armada', path: '/admin/api/edit_armada.php', method: 'POST' },
    { name: 'Hapus Armada', path: '/admin/api/hapus_armada.php', method: 'GET', query: '?id=9999' },
    { name: 'Discount List', path: '/admin/api/discount.php', method: 'GET' },
    { name: 'Manage images', path: '/admin/api/bus_images.php', method: 'GET' },
    { name: 'Tambah Harga', path: '/admin/api/tambah_harga.php', method: 'POST' },
    { name: 'Edit Harga', path: '/admin/api/edit_harga.php', method: 'POST' },
    { name: 'Hapus Harga', path: '/admin/api/hapus_harga.php', method: 'GET', query: '?id=9999' },
    { name: 'Tambah Berita', path: '/admin/api/tambah_news.php', method: 'POST' },
    { name: 'Edit Berita', path: '/admin/api/edit_news.php', method: 'POST' },
    { name: 'Hapus Berita', path: '/admin/api/hapus_news.php', method: 'GET', query: '?id=9999' },
    { name: 'Settings POST', path: '/api/settings.php', method: 'POST' }
  ];

  for (const endpoint of adminEndpoints) {
    const url = `${baseUrl}${endpoint.path}${endpoint.query || ''}`;

    test(`${endpoint.method} ${endpoint.path} - should reject unauthenticated requests with HTTP 401`, async ({ request }) => {
      const response = await request.fetch(url, {
        method: endpoint.method,
        data: endpoint.method === 'POST' ? {} : undefined
      });

      expect(response.status()).toBe(401);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.message).toContain('Unauthorized');
    });

    test(`${endpoint.method} ${endpoint.path} - should reject invalid/fake token with HTTP 401`, async ({ request }) => {
      const response = await request.fetch(url, {
        method: endpoint.method,
        headers: {
          'Authorization': `Bearer ${generateFakeToken()}`
        },
        data: endpoint.method === 'POST' ? {} : undefined
      });

      expect(response.status()).toBe(401);
      const body = await response.json();
      expect(body.success).toBe(false);
    });

    test(`${endpoint.method} ${endpoint.path} - should reject expired token with HTTP 401`, async ({ request }) => {
      const response = await request.fetch(url, {
        method: endpoint.method,
        headers: {
          'Authorization': `Bearer ${generateExpiredToken()}`
        },
        data: endpoint.method === 'POST' ? {} : undefined
      });

      expect(response.status()).toBe(401);
      const body = await response.json();
      expect(body.success).toBe(false);
    });

    test(`${endpoint.method} ${endpoint.path} - should accept valid token and not throw HTTP 401`, async ({ request }) => {
      const response = await request.fetch(url, {
        method: endpoint.method,
        headers: {
          'Authorization': `Bearer ${validToken}`
        },
        data: endpoint.method === 'POST' ? {
          // Send dummy data to trigger logic instead of raw empty errors
          nama_bus: 'Test Bus Unit',
          kapasitas: 40,
          harga_sewa: 3000000,
          nama_destinasi: 'Test Destinasi',
          durasi: '12 Jam',
          harga_elf: 1000000,
          judul: 'Test Judul'
        } : undefined
      });

      // It should NOT be 401 Unauthorized
      expect(response.status()).not.toBe(401);
    });
  }

  // Debug Endpoints Deactivation Check
  const debugPaths = [
    '/api/buses_debug.php',
    '/api/price_list_debug.php',
    '/admin/api/test_info.php'
  ];

  for (const debugPath of debugPaths) {
    test(`Debug endpoint ${debugPath} - should be deactivated and return HTTP 404`, async ({ request }) => {
      const response = await request.get(`${baseUrl}${debugPath}`);
      expect(response.status()).toBe(404);
    });
  }

  // Public Endpoints Check
  const publicEndpoints = [
    '/api/health.php',
    '/api/buses.php',
    '/api/price_list.php',
    '/api/discount.php',
    '/api/news.php',
    '/api/settings.php' // GET settings
  ];

  for (const pubPath of publicEndpoints) {
    test(`Public GET ${pubPath} - should remain accessible without authentication`, async ({ request }) => {
      const response = await request.get(`${baseUrl}${pubPath}`);
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.status).toBe('success');
    });
  }
});
