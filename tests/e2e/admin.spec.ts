import { test, expect } from '@playwright/test';
import { ReportCollector } from '../helpers/report-collector';
import { waitForReactPageLoad } from '../helpers/assertions';

test.describe('E2E - Admin & Security Protection', () => {
  test('PHP Admin - should protect dashboard routes and reject invalid credentials', async ({ page }, testInfo) => {
    const collector = new ReportCollector(page);

    // 1. Visit dashboard page directly without logging in
    await page.goto('/admin/dashboard.php');
    await waitForReactPageLoad(page); // Safe check even on PHP pages
    
    // It should redirect to login page (index.php)
    await expect(page).toHaveURL(/.*index\.php.*/);
    
    // Ensure statistics cards or admin headers are not visible
    const bodyText = await page.innerText('body');
    expect(bodyText.toLowerCase()).not.toContain('total armada');
    expect(bodyText.toLowerCase()).not.toContain('aksi cepat');

    // 2. Test invalid login on the PHP login form
    const usernameInput = page.locator('input[name="username"]');
    const passwordInput = page.locator('input[name="password"]');
    const submitBtn = page.locator('button[type="submit"]');

    await usernameInput.fill('hacker_user');
    await passwordInput.fill('wrongpassword123');
    await submitBtn.click();

    // Verify error banner is displayed
    const errorBanner = page.locator('.bg-red-50');
    await expect(errorBanner).toBeVisible();
    await expect(errorBanner).toContainText(/salah|isi/i);

    await collector.verifyPageLoad(testInfo);
  });

  test('React Admin - should protect dashboard routes and handle login/logout flow', async ({ page }, testInfo) => {
    const collector = new ReportCollector(page);

    // 1. Unauthenticated admin dashboard access
    // Clear localStorage to simulate fresh state
    await page.goto('/admin/login');
    await page.evaluate(() => localStorage.clear());

    await page.goto('/admin/dashboard');
    await waitForReactPageLoad(page);

    // Should redirect to /admin/login
    await expect(page).toHaveURL(/.*\/admin\/login.*/);

    // Expect dashboard content not visible
    const bodyTextUnauth = await page.innerText('body');
    expect(bodyTextUnauth.toLowerCase()).not.toContain('total armada');

    // 2. Try logging in with invalid credentials
    const usernameInput = page.locator('input[name="username"]');
    const passwordInput = page.locator('input[name="password"]');
    const submitBtn = page.locator('button[type="submit"]');

    await usernameInput.fill('invalid_user');
    await passwordInput.fill('invalid_pass');
    await submitBtn.click();

    // Verify error message is visible
    const errorBanner = page.locator('div:has-text("salah")');
    await expect(errorBanner.first()).toBeVisible();

    // 3. Log in with valid credentials
    await usernameInput.fill('admin');
    await passwordInput.fill('admin123');
    await submitBtn.click();

    // Expect redirect to dashboard
    await expect(page).toHaveURL(/.*\/admin\/dashboard.*/);
    await waitForReactPageLoad(page);

    // Dashboard should now be visible
    const bodyTextAuth = await page.innerText('body');
    expect(bodyTextAuth.toLowerCase()).toContain('total armada');

    // Check if token exists in localStorage
    const token = await page.evaluate(() => localStorage.getItem('admin_token'));
    expect(token).not.toBeNull();

    // 4. Click logout and verify token removal
    const logoutBtn = page.locator('button:has-text("Logout")');
    await expect(logoutBtn).toBeVisible();
    await logoutBtn.click();

    // Redirection check
    await expect(page).toHaveURL(/.*\/admin\/login.*/);

    // Token must be removed
    const tokenAfterLogout = await page.evaluate(() => localStorage.getItem('admin_token'));
    expect(tokenAfterLogout).toBeNull();

    // Re-verify that going to dashboard redirects to login
    await page.goto('/admin/dashboard');
    await waitForReactPageLoad(page);
    await expect(page).toHaveURL(/.*\/admin\/login.*/);

    await collector.verifyPageLoad(testInfo);
  });
});
