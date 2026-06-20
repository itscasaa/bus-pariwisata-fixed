import { test, expect } from '@playwright/test';
import { ReportCollector } from '../helpers/report-collector';
import { contactData } from '../helpers/test-data';
import { waitForReactPageLoad } from '../helpers/assertions';

test.describe('E2E - Contact Form', () => {
  test('should display contact form and validate input fields', async ({ page }, testInfo) => {
    const collector = new ReportCollector(page);

    await page.goto('/kontak');
    await waitForReactPageLoad(page);

    const form = page.locator('form');
    await expect(form).toBeVisible();

    const nameInput = page.locator('#nama');
    const emailInput = page.locator('#email');
    const subjectInput = page.locator('#judul');
    const messageInput = page.locator('#pesan');
    const submitBtn = page.locator('button[type="submit"]');

    // Test validation by clicking submit with empty fields (native HTML validation prevents submission)
    // In our React code: it does custom validation if fields are empty
    await submitBtn.click();
    
    // Check if error alerts appear or form requires HTML validation
    const errorAlert = page.locator('.bg-red-50');
    // Since inputs have "required" attribute, HTML native validation will block it, 
    // or if bypassed, React error alert will show up.
    // Let's type invalid email format
    await nameInput.fill(contactData.invalidEmail.nama);
    await emailInput.fill(contactData.invalidEmail.email);
    await subjectInput.fill(contactData.invalidEmail.judul);
    await messageInput.fill(contactData.invalidEmail.pesan);
    await submitBtn.click();

    // Verify format error message
    // HTML5 validation might catch it (invalid email), or our React component error state
    const bodyText = await page.innerText('body');
    const hasValidationError = bodyText.includes('Format email tidak valid') || 
                               await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(hasValidationError).toBe(true);

    // Fill valid data and submit
    await nameInput.fill(contactData.valid.nama);
    await emailInput.fill(contactData.valid.email);
    await subjectInput.fill(contactData.valid.judul);
    await messageInput.fill(contactData.valid.pesan);

    // Listen to network POST request
    const responsePromise = page.waitForResponse(response => 
      response.url().includes('/api/contact.php') && response.status() === 200
    );
    await submitBtn.click();
    
    const response = await responsePromise;
    const resJson = await response.json();
    expect(resJson.status).toBe('success');

    // Confirm UI success alert
    await expect(page.locator('.bg-green-50')).toBeVisible();

    await collector.verifyPageLoad(testInfo);
  });
});
