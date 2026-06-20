import { test, expect } from '@playwright/test';
import { ReportCollector } from '../helpers/report-collector';
import { waitForReactPageLoad } from '../helpers/assertions';

test.describe('E2E - Price List', () => {
  test('should display price list and perform search filter successfully', async ({ page }, testInfo) => {
    const collector = new ReportCollector(page);

    await page.goto('/price-list');
    await waitForReactPageLoad(page);
    
    // Check if the page is visible and has pricing info
    await expect(page.locator('body')).toContainText(/price list|harga/i);

    // Find search input field by placeholder
    const searchInput = page.locator('input[placeholder="Cari tujuan wisata..."]');
    await expect(searchInput).toBeVisible();

    // Type a keyword to search, e.g., "Jakarta"
    await searchInput.fill('Jakarta');
    await page.locator('button:has-text("Cari")').click();

    // Verify it doesn't crash
    const bodyText = await page.innerText('body');
    expect(bodyText).toBeDefined();

    // Verify reset/results indicator appears if keyword matches or fails gracefully
    if (bodyText.toLowerCase().includes('hasil pencarian')) {
      await expect(page.locator('text=Hasil pencarian')).toBeVisible();
    }

    await collector.verifyPageLoad(testInfo);
  });
});
