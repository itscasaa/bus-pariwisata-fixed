import { expect, Page, TestInfo } from '@playwright/test';
import { sensitiveErrorIndicators } from './test-data';

/**
 * Menunggu loader React spinner menghilang agar halaman ter-render sempurna.
 */
export async function waitForReactPageLoad(page: Page) {
  const loader = page.locator('.animate-spin');
  // Check if it appears or is visible, wait for it to be hidden
  try {
    if (await loader.count() > 0) {
      await expect(loader).toBeHidden({ timeout: 15000 });
    }
  } catch (e) {
    // If it was already gone or failed, proceed
  }
}


/**
 * Validasi bahwa string response tidak membocorkan kesalahan server PHP / database MySQL.
 */
export function expectNoServerErrorText(text: string) {
  for (const indicator of sensitiveErrorIndicators) {
    if (text.includes(indicator)) {
      throw new Error(`Kebocoran Informasi Sensitif Terdeteksi: Menemukan indikator error '${indicator}' dalam respons.`);
    }
  }
}

/**
 * Validasi bahwa response memiliki struktur JSON yang valid.
 */
export function expectValidJsonResponse(bodyText: string) {
  try {
    const json = JSON.parse(bodyText);
    expect(json).toBeDefined();
    return json;
  } catch (e) {
    throw new Error(`Respons tidak memiliki format JSON yang valid. Konten: ${bodyText.substring(0, 200)}`);
  }
}

/**
 * Ekstrak data array dari respons API secara aman.
 */
export function getDataArray(body: any): any[] {
  if (!body) return [];
  if (Array.isArray(body)) return body;
  if (body.data && Array.isArray(body.data)) return body.data;
  if (body.data) return [body.data];
  return [];
}

/**
 * Memeriksa semua gambar <img> di halaman untuk mendeteksi broken images.
 */
export async function expectNoBrokenImages(page: Page, testInfo: TestInfo) {
  // Evaluasi semua gambar di halaman
  const images = await page.evaluate(() => {
    const imgElements = Array.from(document.querySelectorAll('img'));
    return imgElements.map(img => ({
      src: img.src,
      outerHTML: img.outerHTML,
      complete: img.complete,
      naturalWidth: img.naturalWidth
    }));
  });

  const brokenImages: string[] = [];

  for (const img of images) {
    // Jika src kosong, atau loading gagal (naturalWidth === 0)
    if (!img.src || (img.complete && img.naturalWidth === 0)) {
      brokenImages.push(img.src || '[src kosong]');
    }
  }

  if (brokenImages.length > 0) {
    // Lampirkan hasil ke testInfo
    await testInfo.attach('broken-images', {
      body: JSON.stringify({ pageUrl: page.url(), brokenImages }, null, 2),
      contentType: 'application/json'
    });
    
    // Kirim warning ke console
    console.warn(`[WARNING] Ditemukan ${brokenImages.length} gambar rusak di halaman ${page.url()}:`, brokenImages);
  }

  expect(brokenImages.length, `Ditemukan gambar rusak di halaman ${page.url()}: ${brokenImages.join(', ')}`).toBe(0);
}

/**
 * Memantau dan mengumpulkan log console error selama interaksi halaman.
 */
export function setupConsoleCollector(page: Page) {
  const errors: { message: string; type: string }[] = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      // Ignore static assets/network resource load failures to avoid failing E2E on content/media 404s
      if (text.includes('Failed to load resource: the server responded with a status of 404') || 
          text.includes('net::ERR_') || 
          text.includes('x-test-bypass') || 
          text.includes('fonts.gstatic.com') ||
          text.includes('favicon.ico')) {
        return;
      }
      errors.push({ message: text, type: 'console' });
    }
  });

  page.on('pageerror', err => {
    errors.push({ message: err.message, type: 'uncaught-exception' });
  });

  return {
    getErrors: () => errors,
    attachIfAny: async (testInfo: TestInfo) => {
      if (errors.length > 0) {
        await testInfo.attach('console-errors', {
          body: JSON.stringify({ pageUrl: page.url(), errors }, null, 2),
          contentType: 'application/json'
        });
      }
    },
    assertNoErrors: () => {
      expect(errors.length, `Terdeteksi ${errors.length} error di console browser: \n${errors.map(e => `[${e.type}] ${e.message}`).join('\n')}`).toBe(0);
    }
  };
}

/**
 * Memantau kegagalan request jaringan penting (network request).
 */
export function setupNetworkCollector(page: Page) {
  const failures: { url: string; method: string; errorText: string }[] = [];

  page.on('requestfailed', request => {
    const url = request.url();
    // Abaikan analytics / favicon yang seringkali opsional
    if (url.includes('google-analytics') || url.includes('favicon.ico')) {
      return;
    }
    failures.push({
      url: request.url(),
      method: request.method(),
      errorText: request.failure()?.errorText || 'Gagal tanpa error code'
    });
  });

  return {
    getFailures: () => failures,
    attachIfAny: async (testInfo: TestInfo) => {
      if (failures.length > 0) {
        await testInfo.attach('network-failures', {
          body: JSON.stringify({ pageUrl: page.url(), failures }, null, 2),
          contentType: 'application/json'
        });
      }
    },
    assertNoCriticalFailures: () => {
      // Kita fokus pada request API/resource internal dari origin yang sama
      const criticalFailures = failures.filter(f => {
        // Anggap critical jika mengarah ke domain lokal atau resource utama (js, css, api)
        return f.url.includes(page.url().replace(/\/$/, '')) || 
               f.url.endsWith('.js') || 
               f.url.endsWith('.css') || 
               f.url.includes('/api/');
      });
      expect(criticalFailures.length, `Terdeteksi kegagalan koneksi jaringan penting: \n${criticalFailures.map(f => `${f.method} ${f.url} -> ${f.errorText}`).join('\n')}`).toBe(0);
    }
  };
}
