# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: vibechecker.spec.js >> UI Components >> Viewport Meta Tag Present
- Location: vibechecker\tests\vibechecker.spec.js:200:3

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
```

# Page snapshot

```yaml
- generic [ref=e2]: Cannot GET /
```

# Test source

```ts
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
  146 |           return;
  147 |         }
  148 |       } catch { /* try next */ }
  149 |     }
  150 |     test.skip();
  151 |   });
  152 | 
  153 |   test('No HTTP 500 on Main Pages', async ({ page }) => {
  154 |     const routes  = ['/', '/about', '/about.php', '/layanan.php'];
  155 |     const errors  = [];
  156 | 
  157 |     for (const route of routes) {
  158 |       try {
  159 |         const res = await page.goto(`${BASE_URL}${route}`);
  160 |         if (res && res.status() >= 500) {
  161 |           errors.push(`${route} → HTTP ${res.status()}`);
  162 |         }
  163 |       } catch { /* skip unreachable */ }
  164 |     }
  165 | 
  166 |     expect(errors).toHaveLength(0);
  167 |   });
  168 | 
  169 | });
  170 | 
  171 | // ─── UI Components ────────────────────────────────────────────────────────────
  172 | 
  173 | test.describe('UI Components', () => {
  174 | 
  175 |   test('Footer Renders', async ({ page }) => {
  176 |     await go(page, '/');
  177 |     try {
  178 |       await expect(page.locator('footer').first()).toBeVisible({ timeout: 5000 });
  179 |     } catch {
  180 |       test.skip();
  181 |     }
  182 |   });
  183 | 
  184 |   test('Images Have Alt Text', async ({ page }) => {
  185 |     await go(page, '/');
  186 |     const images = page.locator('img');
  187 |     const count  = await images.count();
  188 |     if (count === 0) return;
  189 | 
  190 |     const sample = Math.min(count, 5);
  191 |     const missing = [];
  192 |     for (let i = 0; i < sample; i++) {
  193 |       const alt = await images.nth(i).getAttribute('alt');
  194 |       if (alt === null) missing.push(await images.nth(i).getAttribute('src') || `img[${i}]`);
  195 |     }
  196 | 
  197 |     expect(missing.length).toBeLessThanOrEqual(Math.ceil(sample * 0.5));
  198 |   });
  199 | 
  200 |   test('Viewport Meta Tag Present', async ({ page }) => {
  201 |     await go(page, '/');
  202 |     const count = await page.locator('meta[name="viewport"]').count();
> 203 |     expect(count).toBeGreaterThan(0);
      |                   ^ Error: expect(received).toBeGreaterThan(expected)
  204 |   });
  205 | 
  206 | });
  207 | 
  208 | // ─── Performance ─────────────────────────────────────────────────────────────
  209 | 
  210 | test.describe('Performance', () => {
  211 | 
  212 |   test('Homepage Loads Under 10 Seconds', async ({ page }) => {
  213 |     const start = Date.now();
  214 |     await page.goto(`${BASE_URL}/`, { waitUntil: 'load', timeout: 10_000 });
  215 |     expect(Date.now() - start).toBeLessThan(10_000);
  216 |   });
  217 | 
  218 | });
  219 | 
  220 | // ─── Forms ────────────────────────────────────────────────────────────────────
  221 | 
  222 | test.describe('Forms', () => {
  223 | 
  224 |   test('Forms Have Submit Buttons', async ({ page }) => {
  225 |     await go(page, '/');
  226 |     const forms = page.locator('form');
  227 |     const count = await forms.count();
  228 |     if (count === 0) return;
  229 | 
  230 |     for (let i = 0; i < Math.min(count, 3); i++) {
  231 |       const btn = forms.nth(i).locator(
  232 |         'button[type="submit"], input[type="submit"], button'
  233 |       ).first();
  234 |       try {
  235 |         await expect(btn).toBeVisible({ timeout: 2000 });
  236 |       } catch { /* custom form handler — skip */ }
  237 |     }
  238 |   });
  239 | 
  240 | });
  241 | 
```