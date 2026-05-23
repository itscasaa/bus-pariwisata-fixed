/**
 * VibeChecker — playwright.config.js
 * ⚠️  Sesuaikan baseURL dengan port dev server kamu!
 */

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: ['**/*.spec.js', '**/*.test.js'],
  timeout: 20_000,
  globalTimeout: 120_000,
  retries: 1,
  workers: 2,

  reporter: [
    ['json', { outputFile: '.vibechecker-results.json' }],
    ['list'],
  ],

  use: {
    // ⚠️  Ganti sesuai port project kamu (misal: 8000, 8080, 5173)
    baseURL: process.env.VIBE_BASE_URL || 'http://localhost:3003',

    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    navigationTimeout: 15_000,
    actionTimeout: 8_000,
    headless: true,
    ignoreHTTPSErrors: true,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],

  // Auto-start dev server (opsional — uncomment jika mau):
  // webServer: {
  //   command: 'php -S localhost:8000',   // ganti sesuai stack kamu
  //   url: 'http://localhost:8000',
  //   reuseExistingServer: true,
  //   timeout: 30_000,
  // },
});
