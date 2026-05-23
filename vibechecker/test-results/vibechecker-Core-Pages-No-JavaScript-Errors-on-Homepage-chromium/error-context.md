# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: vibechecker.spec.js >> Core Pages >> No JavaScript Errors on Homepage
- Location: vibechecker\tests\vibechecker.spec.js:36:3

# Error details

```
Error: expect(received).toHaveLength(expected)

Expected length: 0
Received length: 1
Received array:  ["Failed to load resource: the server responded with a status of 404 (Not Found)"]
```

# Page snapshot

```yaml
- generic [ref=e2]: Cannot GET /
```

# Test source

```ts
  1   | /**
  2   |  * VibeChecker — tests/vibechecker.spec.js
  3   |  * Browser test suite — sesuaikan selector & URL dengan project kamu.
  4   |  *
  5   |  * Setiap test = satu baris di terminal VibeChecker.
  6   |  * ✓ = passed  ✗ = failed  ⊘ = skipped
  7   |  */
  8   | 
  9   | import { test, expect } from '@playwright/test';
  10  | 
  11  | const BASE_URL = process.env.VIBE_BASE_URL || 'http://localhost:3000';
  12  | 
  13  | // ─── Helper ───────────────────────────────────────────────────────────────────
  14  | 
  15  | async function go(page, urlPath = '/') {
  16  |   await page.goto(`${BASE_URL}${urlPath}`, { waitUntil: 'domcontentloaded' });
  17  | }
  18  | 
  19  | // ─── Core Pages ───────────────────────────────────────────────────────────────
  20  | 
  21  | test.describe('Core Pages', () => {
  22  | 
  23  |   test('Homepage Loaded', async ({ page }) => {
  24  |     await go(page, '/');
  25  |     await expect(page).not.toHaveTitle(/error|not found|500/i);
  26  |     const body = await page.locator('body').innerText();
  27  |     expect(body.trim().length).toBeGreaterThan(0);
  28  |   });
  29  | 
  30  |   test('Homepage Title Valid', async ({ page }) => {
  31  |     await go(page, '/');
  32  |     const title = await page.title();
  33  |     expect(title.length).toBeGreaterThan(0);
  34  |   });
  35  | 
  36  |   test('No JavaScript Errors on Homepage', async ({ page }) => {
  37  |     const errors = [];
  38  |     page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  39  |     page.on('pageerror', err => errors.push(err.message));
  40  | 
  41  |     await go(page, '/');
  42  |     await page.waitForTimeout(2000);
  43  | 
  44  |     const serious = errors.filter(e => !e.includes('favicon') && !e.includes('ERR_ABORTED'));
> 45  |     expect(serious).toHaveLength(0);
      |                     ^ Error: expect(received).toHaveLength(expected)
  46  |   });
  47  | 
  48  | });
  49  | 
  50  | // ─── Navigation ───────────────────────────────────────────────────────────────
  51  | 
  52  | test.describe('Navigation', () => {
  53  | 
  54  |   test('Navigation Links Render', async ({ page }) => {
  55  |     await go(page, '/');
  56  |     const nav = page.locator('nav, header, [role="navigation"]').first();
  57  |     await expect(nav).toBeVisible({ timeout: 8000 });
  58  |   });
  59  | 
  60  |   test('About Page Accessible', async ({ page }) => {
  61  |     // Coba /about dan about.php (untuk project PHP)
  62  |     const paths = ['/about', '/about.php'];
  63  |     for (const p of paths) {
  64  |       const res = await page.goto(`${BASE_URL}${p}`);
  65  |       if (res?.status() === 200) {
  66  |         await expect(page).not.toHaveTitle(/404|error/i);
  67  |         return;
  68  |       }
  69  |     }
  70  |     test.skip();
  71  |   });
  72  | 
  73  |   test('404 Handles Unknown Routes', async ({ page }) => {
  74  |     const res = await page.goto(`${BASE_URL}/halaman-ini-tidak-ada-vibechecker`);
  75  |     expect(res?.status()).not.toBe(500);
  76  |   });
  77  | 
  78  | });
  79  | 
  80  | // ─── Authentication ───────────────────────────────────────────────────────────
  81  | 
  82  | test.describe('Authentication', () => {
  83  | 
  84  |   test('Login Page Renders', async ({ page }) => {
  85  |     const paths = ['/login', '/login.php', '/auth/login', '/signin', '/masuk'];
  86  |     for (const p of paths) {
  87  |       const res = await page.goto(`${BASE_URL}${p}`);
  88  |       if (res?.status() === 200) {
  89  |         await expect(page.locator('body')).toBeVisible();
  90  |         return;
  91  |       }
  92  |     }
  93  |     test.skip();
  94  |   });
  95  | 
  96  |   test('Login Form Has Required Fields', async ({ page }) => {
  97  |     const paths = ['/login', '/login.php', '/auth/login', '/signin'];
  98  |     for (const p of paths) {
  99  |       const res = await page.goto(`${BASE_URL}${p}`);
  100 |       if (res?.status() === 200) {
  101 |         try {
  102 |           const email = page.locator('input[type="email"], input[name="email"], input[name="username"]').first();
  103 |           const pass  = page.locator('input[type="password"]').first();
  104 |           await expect(email).toBeVisible({ timeout: 3000 });
  105 |           await expect(pass).toBeVisible({ timeout: 3000 });
  106 |         } catch {
  107 |           test.skip();
  108 |         }
  109 |         return;
  110 |       }
  111 |     }
  112 |     test.skip();
  113 |   });
  114 | 
  115 | });
  116 | 
  117 | // ─── Dashboard / Admin ────────────────────────────────────────────────────────
  118 | 
  119 | test.describe('Dashboard', () => {
  120 | 
  121 |   test('Admin Panel Route Responds', async ({ page }) => {
  122 |     const paths = ['/admin', '/admin-panel', '/dashboard', '/panel'];
  123 |     for (const p of paths) {
  124 |       const res = await page.goto(`${BASE_URL}${p}`);
  125 |       if (res && [200, 302].includes(res.status())) {
  126 |         await expect(page.locator('body')).toBeVisible();
  127 |         return;
  128 |       }
  129 |     }
  130 |     test.skip();
  131 |   });
  132 | 
  133 | });
  134 | 
  135 | // ─── API Health ───────────────────────────────────────────────────────────────
  136 | 
  137 | test.describe('API Health', () => {
  138 | 
  139 |   test('API Endpoint Responds', async ({ request }) => {
  140 |     const paths = ['/api', '/api/health', '/api/status', '/api/v1'];
  141 |     for (const p of paths) {
  142 |       try {
  143 |         const res = await request.get(`${BASE_URL}${p}`, { timeout: 5000 });
  144 |         if (res.status() < 500) {
  145 |           expect(res.status()).toBeLessThan(500);
```