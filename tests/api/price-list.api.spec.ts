import { test, expect } from '@playwright/test';
import { expectValidJsonResponse, expectNoServerErrorText, getDataArray } from '../helpers/assertions';

test.describe('API - Price List', () => {
  test('GET /api/price_list.php should return status 200 and a list of prices', async ({ request }) => {
    const response = await request.get('/api/price_list.php');
    expect(response.status()).toBe(200);

    const bodyText = await response.text();
    expectNoServerErrorText(bodyText);

    const json = expectValidJsonResponse(bodyText);
    expect(json.status).toBe('success');
    expect(json).toHaveProperty('data');

    const prices = getDataArray(json);
    if (prices.length > 0) {
      const entry = prices[0];
      expect(entry).toHaveProperty('id');
      expect(entry).toHaveProperty('nama_destinasi');
      expect(entry).toHaveProperty('durasi');
      expect(entry).toHaveProperty('harga_hiace');
      expect(entry).toHaveProperty('harga_elf');
      expect(entry).toHaveProperty('harga_medium');
      expect(entry).toHaveProperty('harga_big');
    }
  });

  test('GET /api/price_list.php?keyword=jakarta should return filtered results', async ({ request }) => {
    const response = await request.get('/api/price_list.php?keyword=jakarta');
    expect(response.status()).toBe(200);

    const bodyText = await response.text();
    expectNoServerErrorText(bodyText);

    const json = expectValidJsonResponse(bodyText);
    expect(json.status).toBe('success');
    expect(json).toHaveProperty('data');

    const data = getDataArray(json);
    // Even if empty, it should be an array and not crash
    expect(Array.isArray(data)).toBe(true);
  });

  test('GET /api/price_list.php?keyword=nonexistentdestination12345 should return empty data gracefully', async ({ request }) => {
    const response = await request.get('/api/price_list.php?keyword=nonexistentdestination12345');
    expect(response.status()).toBe(200);

    const bodyText = await response.text();
    expectNoServerErrorText(bodyText);

    const json = expectValidJsonResponse(bodyText);
    expect(json.status).toBe('success');
    expect(json.data.length).toBe(0);
  });
});
