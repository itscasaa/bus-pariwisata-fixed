# ⚡ VibeChecker
> AI-Style Self Monitoring Development System

---

## 🚀 Setup (3 langkah)

```bash
# 1. Masuk folder vibechecker
cd vibechecker

# 2. Install dependencies
npm install

# 3. Install browser Playwright
npx playwright install chromium
```

---

## ▶️ Cara Jalankan

```bash
# Start website kamu dulu (contoh PHP):
php -S localhost:8000

# Lalu di terminal lain, jalankan VibeChecker:
cd vibechecker
node watcher.js
```

### Custom options
```bash
# Ganti folder yang diwatch
node watcher.js --path ../src

# Ganti URL target
node watcher.js --url http://localhost:8000

# Jalankan sekali lalu exit (untuk CI/CD)
node watcher.js --once

# Kombinasi
node watcher.js --path ../frontend --url http://localhost:8000
```

---

## ⚙️ Konfigurasi

Edit `playwright.config.js`:
```js
baseURL: 'http://localhost:8000',  // ← sesuaikan port kamu
```

Atau pakai env variable:
```bash
VIBE_BASE_URL=http://localhost:8000 node watcher.js
```

---

## 📁 Struktur File

```
vibechecker/
├── watcher.js          ← Entry point utama
├── validator.js        ← Runner Playwright + parser hasil
├── ui.js               ← Terminal UI (chalk, boxen, ora)
├── errorParser.js      ← Pattern matching error + saran fix
├── playwright.config.js← Config Playwright
├── package.json
└── tests/
    └── vibechecker.spec.js  ← Test suite browser
```

---

## 🧪 Tambah Test Custom

Edit `tests/vibechecker.spec.js`:

```js
test('Fitur Checkout Berjalan', async ({ page }) => {
  await page.goto('http://localhost:8000/checkout');
  await expect(page.locator('#cart-total')).toBeVisible();
  await page.click('#btn-order');
  await expect(page.locator('.success-message')).toHaveText('Order berhasil!');
});
```

---

## 💡 Tips

- Pakai `data-testid` di HTML untuk selector yang stabil
- Jalankan VibeChecker di terminal split berdampingan dengan editor
- Flag `--once` cocok untuk CI/CD pipeline
- Set `headless: false` di `playwright.config.js` untuk debug visual
