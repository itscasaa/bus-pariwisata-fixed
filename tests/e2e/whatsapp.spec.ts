import { test, expect } from '@playwright/test';
import { ReportCollector } from '../helpers/report-collector';
import { waitForReactPageLoad } from '../helpers/assertions';

test.describe('E2E - WhatsApp Floating Button', () => {
  test('should display floating WhatsApp button with correct phone link format on all viewports', async ({ page }, testInfo) => {
    const collector = new ReportCollector(page);

    await page.goto('/');
    await waitForReactPageLoad(page);

    // Locate the floating WhatsApp button
    const waButton = page.locator('a[aria-label="WhatsApp"]');
    await expect(waButton).toBeVisible();

    // Verify href contains international WhatsApp schema and correct phone number
    const href = await waButton.getAttribute('href');
    expect(href).not.toBeNull();
    
    const isValidWaUrl = href!.includes('wa.me') || href!.includes('api.whatsapp.com');
    expect(isValidWaUrl).toBe(true);
    expect(href).toContain('6285199802536');

    // Confirm presence of fontawesome icon inside the link
    const icon = waButton.locator('i.fa-whatsapp');
    await expect(icon).toBeVisible();

    await collector.verifyPageLoad(testInfo);
  });
});
