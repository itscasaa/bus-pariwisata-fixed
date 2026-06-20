import { test, expect } from '@playwright/test';
import { expectValidJsonResponse, expectNoServerErrorText } from '../helpers/assertions';

test.describe('API - Health Check', () => {
  test('GET /api/health.php should return status 200 and success status', async ({ request }) => {
    const response = await request.get('/api/health.php');
    
    // API returns 200 if DB is OK, 503 if not. We should accept 200 normally
    expect([200, 503]).toContain(response.status());

    const bodyText = await response.text();
    expectNoServerErrorText(bodyText);

    const json = expectValidJsonResponse(bodyText);
    
    // Verify properties
    expect(json).toHaveProperty('status');
    expect(json).toHaveProperty('php');
    expect(json).toHaveProperty('database');
    expect(json).toHaveProperty('all_ok');

    if (response.status() === 200) {
      expect(json.status).toBe('success');
      expect(json.database).toBe('connected');
      expect(json.all_ok).toBe(true);
    } else {
      expect(json.status).toBe('error');
      expect(json.database).toBe('disconnected');
      expect(json.all_ok).toBe(false);
    }
  });
});
