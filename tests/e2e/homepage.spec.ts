import { test, expect } from '@playwright/test';
import { ReportCollector } from '../helpers/report-collector';
import { waitForReactPageLoad } from '../helpers/assertions';

test.describe('E2E - Homepage', () => {
  test('should load the homepage and render all sections without errors', async ({ page }, testInfo) => {
    const collector = new ReportCollector(page);

    await page.goto('/');
    await waitForReactPageLoad(page);
    
    // Check if the page is readable
    await expect(page.locator('body')).toBeVisible();

    // Verify brand text or relevant words
    const bodyText = await page.innerText('body');
    const matchesBrand = /mafina|trans|bus|pariwisata|travel/i.test(bodyText);
    expect(matchesBrand).toBe(true);

    // Verify presence of main components
    await expect(page.locator('nav')).toBeVisible();
    
    // Perform console errors, network requests, and broken images verification
    await collector.verifyPageLoad(testInfo);
  });
});
