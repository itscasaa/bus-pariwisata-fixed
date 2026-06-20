import { test, expect } from '@playwright/test';

test.describe('API - Admin Authentication Security', () => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

  test('POST /admin/api/login.php - should succeed with valid credentials', async ({ request }) => {
    const res = await request.post(`${baseUrl}/admin/api/login.php`, {
      data: {
        username: 'admin',
        password: 'admin123'
      }
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    
    // Assert structured successful response
    expect(body.status).toBe('success');
    expect(body.message).toContain('Login berhasil');
    expect(body.data).toBeDefined();
    expect(body.data.token).toBeDefined();
    expect(body.data.nama).toBeDefined();
    
    // Token should have correct format (base64payload.signature)
    expect(body.data.token).toMatch(/^[a-zA-Z0-9_\-+/=]+\.[a-zA-Z0-9_\-]+$/);
  });

  test('POST /admin/api/login.php - should reject invalid credentials with generic message', async ({ request }) => {
    const res = await request.post(`${baseUrl}/admin/api/login.php`, {
      data: {
        username: 'admin',
        password: 'wrong_password_xyz'
      }
    });

    expect(res.status()).toBe(200); // login.php returns status 200 with error JSON
    const body = await res.json();

    expect(body.status).toBe('error');
    // Ensure generic error message is used
    expect(body.message).toMatch(/salah|tidak valid/i);
    expect(body.data).toEqual([]);
  });

  test('POST /admin/api/login.php - should reject missing parameters', async ({ request }) => {
    const res = await request.post(`${baseUrl}/admin/api/login.php`, {
      data: {
        username: 'admin'
      }
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('error');
    expect(body.message).toContain('wajib diisi');
  });

  test('POST /admin/api/login.php - should never leak sensitive errors', async ({ request }) => {
    const res = await request.post(`${baseUrl}/admin/api/login.php`, {
      data: {
        username: "admin' OR 1=1 --",
        password: 'any'
      }
    });

    const text = await res.text();
    
    // Ensure no raw SQL or PHP database errors are present
    expect(text).not.toContain('mysqli');
    expect(text).not.toContain('SQL syntax');
    expect(text).not.toContain('Fatal error');
    expect(text).not.toContain('Stack trace');
    expect(text).not.toContain('Warning:');
  });
});
