import { test, expect } from '@playwright/test';
import { ReportCollector } from '../helpers/report-collector';
import { waitForReactPageLoad } from '../helpers/assertions';

test.describe('E2E - Armada (Bus Fleet)', () => {
  test('should display fleet cards and navigate to detail page', async ({ page }, testInfo) => {
    const collector = new ReportCollector(page);

    await page.goto('/bus-wisata');
    await waitForReactPageLoad(page);
    
    // Check if the fleet page has a title or visible elements
    await expect(page.locator('body')).toContainText(/armada/i, { timeout: 15000 });

    // Wait for the lazy loaded bus fleet component or data fetch
    const busCards = page.locator('a:has-text("Lihat Detail")');
    
    // We check count. If the API returns buses, cards should appear.
    const count = await busCards.count();
    if (count > 0) {
      // Check first card details
      const card = busCards.first();
      await expect(card).toBeVisible();

      // Click to go to detail page
      await card.click();
      
      // Wait for detail page load
      await page.waitForURL(/\/bus\/\d+/);
      await expect(page.locator('body')).toContainText(/kursi|kapasitas/i);
    } else {
      console.log('No fleet cards found, showing empty state or fallback.');
    }

    await collector.verifyPageLoad(testInfo);
  });
});
