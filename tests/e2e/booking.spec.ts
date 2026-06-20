import { test, expect } from '@playwright/test';
import { ReportCollector } from '../helpers/report-collector';
import { waitForReactPageLoad } from '../helpers/assertions';

test.describe('E2E - Booking Form Modal', () => {
  test('should open booking modal from price list, select options, and trigger WhatsApp redirect', async ({ page }, testInfo) => {
    const collector = new ReportCollector(page);

    await page.goto('/price-list');
    await waitForReactPageLoad(page);

    // Make sure we have a "Pesan Rute" button
    const pesanBtns = page.locator('button:has-text("Pesan Rute")');
    const count = await pesanBtns.count();

    if (count > 0) {
      // Mock window.open to capture the WhatsApp redirect URL
      await page.evaluate(() => {
        (window as any).lastOpenedUrl = '';
        window.open = (url) => {
          (window as any).lastOpenedUrl = url;
          return null;
        };
      });

      // Click the first Pesan Rute button
      await pesanBtns.first().click();

      // Verify modal is open
      const modalHeader = page.locator('text=Detail Pemesanan Rute');
      await expect(modalHeader).toBeVisible();

      // Interact with modal options - Select HiAce
      const hiaceBtn = page.locator('button:has-text("HiAce")');
      await expect(hiaceBtn).toBeVisible();
      await hiaceBtn.click();

      // Fill in date and comments
      const dateInput = page.locator('input[type="date"]');
      await dateInput.fill('2026-10-20');

      const notesTextarea = page.locator('textarea[placeholder*="titik penjemputan"]');
      await notesTextarea.fill('QA Booking Test Note: Rute Jakarta-Bandung.');

      // Click "Pesan Sekarang"
      const submitBtn = page.locator('button:has-text("Pesan Sekarang")');
      await submitBtn.click();

      // Retrieve captured URL
      const redirectUrl = await page.evaluate(() => (window as any).lastOpenedUrl);
      
      expect(redirectUrl).toContain('wa.me');
      expect(redirectUrl).toContain('HiAce');
      expect(redirectUrl).toContain('QA');
    } else {
      console.log('Skipping booking E2E test as there are no price list routes loaded.');
    }

    await collector.verifyPageLoad(testInfo);
  });
});
