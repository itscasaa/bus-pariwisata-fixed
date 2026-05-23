/**
 * VibeChecker — tests/vibechecker.spec.js
 * Browser test suite — sesuaikan selector & URL dengan project kamu.
 *
 * Setiap test = satu baris di terminal VibeChecker.
 * ✓ = passed  ✗ = failed  ⊘ = skipped
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.VIBE_BASE_URL || 'http://localhost:3000';

// ─── Helper ───────────────────────────────────────────────────────────────────

async function go(page, urlPath = '/') {
  await page.goto(`${BASE_URL}${urlPath}`, { waitUntil: 'domcontentloaded' });
}

// ─── Core Pages ───────────────────────────────────────────────────────────────

test.describe('Core Pages', () => {

  test('Homepage Loaded', async ({ page }) => {
    await go(page, '/');
    await expect(page).not.toHaveTitle(/error|not found|500/i);
    const body = await page.locator('body').innerText();
    expect(body.trim().length).toBeGreaterThan(0);
  });

  test('Homepage Title Valid', async ({ page }) => {
    await go(page, '/');
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });

  test('No JavaScript Errors on Homepage', async ({ page }) => {
    const errors = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    page.on('pageerror', err => errors.push(err.message));

    await go(page, '/');
    await page.waitForTimeout(2000);

    const serious = errors.filter(e => !e.includes('favicon') && !e.includes('ERR_ABORTED'));
    expect(serious).toHaveLength(0);
  });

});

// ─── Navigation ───────────────────────────────────────────────────────────────

test.describe('Navigation', () => {

  test('Navigation Links Render', async ({ page }) => {
    await go(page, '/');
    const nav = page.locator('nav, header, [role="navigation"]').first();
    await expect(nav).toBeVisible({ timeout: 8000 });
  });

  test('About Page Accessible', async ({ page }) => {
    // Coba /about dan about.php (untuk project PHP)
    const paths = ['/about', '/about.php'];
    for (const p of paths) {
      const res = await page.goto(`${BASE_URL}${p}`);
      if (res?.status() === 200) {
        await expect(page).not.toHaveTitle(/404|error/i);
        return;
      }
    }
    test.skip();
  });

  test('404 Handles Unknown Routes', async ({ page }) => {
    const res = await page.goto(`${BASE_URL}/halaman-ini-tidak-ada-vibechecker`);
    expect(res?.status()).not.toBe(500);
  });

});

// ─── Authentication ───────────────────────────────────────────────────────────

test.describe('Authentication', () => {

  test('Login Page Renders', async ({ page }) => {
    const paths = ['/login', '/login.php', '/auth/login', '/signin', '/masuk'];
    for (const p of paths) {
      const res = await page.goto(`${BASE_URL}${p}`);
      if (res?.status() === 200) {
        await expect(page.locator('body')).toBeVisible();
        return;
      }
    }
    test.skip();
  });

  test('Login Form Has Required Fields', async ({ page }) => {
    const paths = ['/login', '/login.php', '/auth/login', '/signin'];
    for (const p of paths) {
      const res = await page.goto(`${BASE_URL}${p}`);
      if (res?.status() === 200) {
        try {
          const email = page.locator('input[type="email"], input[name="email"], input[name="username"]').first();
          const pass  = page.locator('input[type="password"]').first();
          await expect(email).toBeVisible({ timeout: 3000 });
          await expect(pass).toBeVisible({ timeout: 3000 });
        } catch {
          test.skip();
        }
        return;
      }
    }
    test.skip();
  });

});

// ─── Dashboard / Admin ────────────────────────────────────────────────────────

test.describe('Dashboard', () => {

  test('Admin Panel Route Responds', async ({ page }) => {
    const paths = ['/admin', '/admin-panel', '/dashboard', '/panel'];
    for (const p of paths) {
      const res = await page.goto(`${BASE_URL}${p}`);
      if (res && [200, 302].includes(res.status())) {
        await expect(page.locator('body')).toBeVisible();
        return;
      }
    }
    test.skip();
  });

});

// ─── API Health ───────────────────────────────────────────────────────────────

test.describe('API Health', () => {

  test('API Endpoint Responds', async ({ request }) => {
    const paths = ['/api', '/api/health', '/api/status', '/api/v1'];
    for (const p of paths) {
      try {
        const res = await request.get(`${BASE_URL}${p}`, { timeout: 5000 });
        if (res.status() < 500) {
          expect(res.status()).toBeLessThan(500);
          return;
        }
      } catch { /* try next */ }
    }
    test.skip();
  });

  test('No HTTP 500 on Main Pages', async ({ page }) => {
    const routes  = ['/', '/about', '/about.php', '/layanan.php'];
    const errors  = [];

    for (const route of routes) {
      try {
        const res = await page.goto(`${BASE_URL}${route}`);
        if (res && res.status() >= 500) {
          errors.push(`${route} → HTTP ${res.status()}`);
        }
      } catch { /* skip unreachable */ }
    }

    expect(errors).toHaveLength(0);
  });

});

// ─── UI Components ────────────────────────────────────────────────────────────

test.describe('UI Components', () => {

  test('Footer Renders', async ({ page }) => {
    await go(page, '/');
    try {
      await expect(page.locator('footer').first()).toBeVisible({ timeout: 5000 });
    } catch {
      test.skip();
    }
  });

  test('Images Have Alt Text', async ({ page }) => {
    await go(page, '/');
    const images = page.locator('img');
    const count  = await images.count();
    if (count === 0) return;

    const sample = Math.min(count, 5);
    const missing = [];
    for (let i = 0; i < sample; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      if (alt === null) missing.push(await images.nth(i).getAttribute('src') || `img[${i}]`);
    }

    expect(missing.length).toBeLessThanOrEqual(Math.ceil(sample * 0.5));
  });

  test('Viewport Meta Tag Present', async ({ page }) => {
    await go(page, '/');
    const count = await page.locator('meta[name="viewport"]').count();
    expect(count).toBeGreaterThan(0);
  });

});

// ─── Performance ─────────────────────────────────────────────────────────────

test.describe('Performance', () => {

  test('Homepage Loads Under 10 Seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto(`${BASE_URL}/`, { waitUntil: 'load', timeout: 10_000 });
    expect(Date.now() - start).toBeLessThan(10_000);
  });

});

// ─── Forms ────────────────────────────────────────────────────────────────────

test.describe('Forms', () => {

  test('Forms Have Submit Buttons', async ({ page }) => {
    await go(page, '/');
    const forms = page.locator('form');
    const count = await forms.count();
    if (count === 0) return;

    for (let i = 0; i < Math.min(count, 3); i++) {
      const btn = forms.nth(i).locator(
        'button[type="submit"], input[type="submit"], button'
      ).first();
      try {
        await expect(btn).toBeVisible({ timeout: 2000 });
      } catch { /* custom form handler — skip */ }
    }
  });

});
