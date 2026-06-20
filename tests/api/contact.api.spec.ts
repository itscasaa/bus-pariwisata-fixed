import { test, expect } from '@playwright/test';
import { expectValidJsonResponse, expectNoServerErrorText } from '../helpers/assertions';
import { contactData, xssPayloads, sqlInjectionPayloads } from '../helpers/test-data';

test.describe('API - Contact Form', () => {
  test('POST /api/contact.php should accept valid submission and return success', async ({ request }) => {
    const response = await request.post('/api/contact.php', {
      data: contactData.valid
    });
    expect(response.status()).toBe(200);

    const bodyText = await response.text();
    expectNoServerErrorText(bodyText);

    const json = expectValidJsonResponse(bodyText);
    expect(json.status).toBe('success');
    expect(json.message).toContain('Pesan berhasil terkirim');
  });

  test('POST /api/contact.php should reject empty submission', async ({ request }) => {
    const response = await request.post('/api/contact.php', {
      data: contactData.empty
    });
    expect(response.status()).toBe(200); // PHP script defaults to 200 with status: error

    const bodyText = await response.text();
    expectNoServerErrorText(bodyText);

    const json = expectValidJsonResponse(bodyText);
    expect(json.status).toBe('error');
    expect(json.message).toContain('wajib diisi');
  });

  test('POST /api/contact.php should reject invalid email format', async ({ request }) => {
    const response = await request.post('/api/contact.php', {
      data: contactData.invalidEmail
    });
    expect(response.status()).toBe(200);

    const bodyText = await response.text();
    expectNoServerErrorText(bodyText);

    const json = expectValidJsonResponse(bodyText);
    expect(json.status).toBe('error');
    expect(json.message).toContain('Format email tidak valid');
  });

  // Security checks: XSS payload in form field
  for (const payload of xssPayloads) {
    test(`POST /api/contact.php should handle XSS payload safely: "${payload.substring(0, 20)}"`, async ({ request }) => {
      const response = await request.post('/api/contact.php', {
        data: {
          ...contactData.valid,
          nama: payload,
          pesan: payload
        }
      });
      expect(response.status()).toBe(200);

      const bodyText = await response.text();
      expectNoServerErrorText(bodyText);

      const json = expectValidJsonResponse(bodyText);
      expect(json.status).toBe('success'); // API inserts safely using prepared statements
    });
  }

  // Security checks: SQL Injection payload
  for (const payload of sqlInjectionPayloads) {
    test(`POST /api/contact.php should not crash under SQL Injection: "${payload}"`, async ({ request }) => {
      const response = await request.post('/api/contact.php', {
        data: {
          ...contactData.valid,
          email: 'sql.inj@test.local',
          judul: payload
        }
      });
      expect(response.status()).toBe(200);

      const bodyText = await response.text();
      // Ensure no database error is leaked
      expectNoServerErrorText(bodyText);

      const json = expectValidJsonResponse(bodyText);
      expect(json.status).toBe('success'); // Query works safely because of prepared statements
    });
  }
});
