import { test, expect } from '@playwright/test';
import { expectValidJsonResponse, expectNoServerErrorText } from '../helpers/assertions';
import { bookingData, xssPayloads, sqlInjectionPayloads } from '../helpers/test-data';

test.describe('API - Booking Form', () => {
  test('POST /api/booking.php should accept valid full booking and return success', async ({ request }) => {
    // Note: booking.php parses urlencoded body ($_POST)
    // We should send as form data instead of JSON
    const response = await request.post('/api/booking.php', {
      form: bookingData.valid
    });
    expect(response.status()).toBe(200);

    const bodyText = await response.text();
    expectNoServerErrorText(bodyText);

    const json = expectValidJsonResponse(bodyText);
    expect(json.status).toBe('success');
    expect(json.message).toContain('Booking berhasil dibuat');
  });

  test('POST /api/booking.php should accept valid minimal booking parameters', async ({ request }) => {
    const response = await request.post('/api/booking.php', {
      form: bookingData.validMinimal
    });
    expect(response.status()).toBe(200);

    const bodyText = await response.text();
    expectNoServerErrorText(bodyText);

    const json = expectValidJsonResponse(bodyText);
    expect(json.status).toBe('success');
  });

  test('POST /api/booking.php should reject booking when required fields are missing', async ({ request }) => {
    const response = await request.post('/api/booking.php', {
      form: bookingData.empty
    });
    expect(response.status()).toBe(200);

    const bodyText = await response.text();
    expectNoServerErrorText(bodyText);

    const json = expectValidJsonResponse(bodyText);
    expect(json.status).toBe('error');
    expect(json.message).toContain('Field wajib');
  });

  test('POST /api/booking.php should reject invalid email format', async ({ request }) => {
    const response = await request.post('/api/booking.php', {
      form: bookingData.invalidEmail
    });
    expect(response.status()).toBe(200);

    const bodyText = await response.text();
    expectNoServerErrorText(bodyText);

    const json = expectValidJsonResponse(bodyText);
    expect(json.status).toBe('error');
    expect(json.message).toContain('Format email tidak valid');
  });

  test('POST /api/booking.php should reject non-numeric passenger counts', async ({ request }) => {
    const response = await request.post('/api/booking.php', {
      form: bookingData.invalidJumlah
    });
    expect(response.status()).toBe(200);

    const bodyText = await response.text();
    expectNoServerErrorText(bodyText);

    const json = expectValidJsonResponse(bodyText);
    expect(json.status).toBe('error');
    expect(json.message).toContain('jumlah harus angka');
  });

  // Security: XSS Payloads
  for (const payload of xssPayloads) {
    test(`POST /api/booking.php should handle XSS payload safely: "${payload.substring(0, 20)}"`, async ({ request }) => {
      const response = await request.post('/api/booking.php', {
        form: {
          ...bookingData.valid,
          nama: payload,
          tujuan: payload
        }
      });
      expect(response.status()).toBe(200);

      const bodyText = await response.text();
      expectNoServerErrorText(bodyText);

      const json = expectValidJsonResponse(bodyText);
      expect(json.status).toBe('success');
    });
  }

  // Security: SQL Injection Payloads
  for (const payload of sqlInjectionPayloads) {
    test(`POST /api/booking.php should not crash under SQL Injection: "${payload}"`, async ({ request }) => {
      const response = await request.post('/api/booking.php', {
        form: {
          ...bookingData.valid,
          nama: 'SQL Test Client',
          tujuan: payload
        }
      });
      expect(response.status()).toBe(200);

      const bodyText = await response.text();
      expectNoServerErrorText(bodyText);

      const json = expectValidJsonResponse(bodyText);
      expect(json.status).toBe('success');
    });
  }
});
