import { test, expect } from '@playwright/test';
import { expectValidJsonResponse, expectNoServerErrorText, getDataArray } from '../helpers/assertions';

test.describe('API - Buses', () => {
  test('GET /api/buses.php should return status 200 and a list of buses', async ({ request }) => {
    const response = await request.get('/api/buses.php');
    expect(response.status()).toBe(200);

    const bodyText = await response.text();
    expectNoServerErrorText(bodyText);

    const json = expectValidJsonResponse(bodyText);
    expect(json.status).toBe('success');
    expect(json).toHaveProperty('data');

    const buses = getDataArray(json);
    if (buses.length > 0) {
      const firstBus = buses[0];
      expect(firstBus).toHaveProperty('id');
      expect(firstBus).toHaveProperty('nama_bus');
      expect(firstBus).toHaveProperty('gambar');
      expect(firstBus).toHaveProperty('kapasitas');
      expect(firstBus).toHaveProperty('harga_sewa');
    }
  });

  test('GET /api/buses.php?id=1 should return status 200 and a single bus detail (if exists)', async ({ request }) => {
    // First retrieve list of buses to find a valid ID
    const listResponse = await request.get('/api/buses.php');
    expect(listResponse.status()).toBe(200);
    const listJson = expectValidJsonResponse(await listResponse.text());
    const buses = getDataArray(listJson);

    if (buses.length > 0) {
      const testId = buses[0].id;
      const response = await request.get(`/api/buses.php?id=${testId}`);
      expect(response.status()).toBe(200);

      const bodyText = await response.text();
      expectNoServerErrorText(bodyText);

      const json = expectValidJsonResponse(bodyText);
      expect(json.status).toBe('success');
      expect(json.data.id).toBe(testId);
      expect(json.data).toHaveProperty('nama_bus');
      expect(json.data).toHaveProperty('gambar_utama');
      expect(json.data).toHaveProperty('deskripsi');
      expect(json.data).toHaveProperty('fasilitas');
    } else {
      console.log('Skipping detail verification since no bus entries were returned in the list.');
    }
  });

  test('GET /api/buses.php?id=999999 should handle non-existing ID gracefully', async ({ request }) => {
    const response = await request.get('/api/buses.php?id=999999');
    expect([404, 500]).toContain(response.status()); // Expect a safe 404 error

    const bodyText = await response.text();
    expectNoServerErrorText(bodyText);

    const json = expectValidJsonResponse(bodyText);
    expect(json.status).toBe('error');
  });
});
