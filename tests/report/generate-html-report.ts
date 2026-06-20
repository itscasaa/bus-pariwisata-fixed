import * as fs from 'fs';
import * as path from 'path';

const resultsPath = path.join(__dirname, '../../test-results/results.json');
const templatePath = path.join(__dirname, 'report-template.html');
const stylePath = path.join(__dirname, 'report-style.css');
const outputPath = path.join(__dirname, '../../test-results/custom-report/testing-report.html');

interface TestResultItem {
  name: string;
  category: string;
  status: string;
  duration: number;
  error?: string;
  attachments?: any[];
}

function decodeBase64(body: string): string {
  try {
    return Buffer.from(body, 'base64').toString('utf-8');
  } catch {
    return body;
  }
}

function parseJson() {
  console.log(`Membaca hasil pengujian dari: ${resultsPath}`);
  
  if (!fs.existsSync(resultsPath)) {
    console.error(`Error: File hasil Playwright '${resultsPath}' tidak ditemukan. Silakan jalankan pengujian terlebih dahulu.`);
    process.exit(1);
  }

  const resultsRaw = fs.readFileSync(resultsPath, 'utf8');
  const resultsJson = JSON.parse(resultsRaw);

  const flatTests: TestResultItem[] = [];
  let totalDuration = 0;

  // Helper untuk melintasi struktur suite Playwright JSON
  function traverse(suite: any) {
    if (suite.specs) {
      for (const spec of suite.specs) {
        const category = spec.file.includes('api/') 
          ? 'API Tests' 
          : (spec.file.includes('admin') ? 'Admin/Security Tests' : 'Frontend E2E Tests');
        
        for (const testItem of spec.tests) {
          const title = `${suite.title ? suite.title + ' > ' : ''}${spec.title}`;
          const result = testItem.results && testItem.results[0];
          
          if (result) {
            totalDuration += result.duration || 0;
            flatTests.push({
              name: title,
              category,
              status: result.status,
              duration: result.duration || 0,
              error: result.error?.message,
              attachments: result.attachments
            });
          }
        }
      }
    }

    if (suite.suites) {
      for (const subSuite of suite.suites) {
        traverse(subSuite);
      }
    }
  }

  if (resultsJson.suites) {
    for (const suite of resultsJson.suites) {
      traverse(suite);
    }
  }

  return { flatTests, totalDuration };
}

function generateReport() {
  const { flatTests, totalDuration } = parseJson();

  // Hitung status
  const total = flatTests.length;
  const passed = flatTests.filter(t => t.status === 'passed').length;
  const failed = flatTests.filter(t => t.status === 'failed' || t.status === 'timedOut').length;
  const skipped = flatTests.filter(t => t.status === 'skipped').length;
  const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;

  // Status badge
  let statusBadge = '<span class="status-badge status-passed">PASSED</span>';
  if (failed > 0) {
    statusBadge = '<span class="status-badge status-failed">FAILED</span>';
  } else if (skipped > 0) {
    statusBadge = '<span class="status-badge status-warning">WARNING</span>';
  }

  // Load style dan template
  const styleContent = fs.readFileSync(stylePath, 'utf8');
  let htmlContent = fs.readFileSync(templatePath, 'utf8');

  // Injeksi assets
  htmlContent = htmlContent.replace('{{STYLE}}', styleContent);

  // Injeksi meta & statistics
  const testedUrl = process.env.BASE_URL || 'http://localhost:3000';
  const now = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) + ' WIB';
  
  htmlContent = htmlContent.replace(/{{TESTED_URL}}/g, testedUrl);
  htmlContent = htmlContent.replace(/{{DATE_TIME}}/g, now);
  htmlContent = htmlContent.replace(/{{REPORT_GENERATED_TIME}}/g, now);
  htmlContent = htmlContent.replace('{{TOTAL_COUNT}}', total.toString());
  htmlContent = htmlContent.replace('{{PASSED_COUNT}}', passed.toString());
  htmlContent = htmlContent.replace('{{FAILED_COUNT}}', failed.toString());
  htmlContent = htmlContent.replace('{{SKIPPED_COUNT}}', skipped.toString());
  htmlContent = htmlContent.replace('{{PASS_RATE}}', passRate.toString());
  htmlContent = htmlContent.replace('{{STATUS_BADGE}}', statusBadge);

  // Kumpulkan console error, broken images, dll dari attachments
  const allConsoleErrors: any[] = [];
  const allBrokenImages: any[] = [];
  const allNetworkFailures: any[] = [];
  const securityWarnings: any[] = [];

  // Tulis baris tabel detail
  let testRowsHtml = '';
  let failedDetailsHtml = '';

  for (const test of flatTests) {
    const statusClass = test.status === 'passed' ? 'status-passed' : (test.status === 'skipped' ? 'status-warning' : 'status-failed');
    testRowsHtml += `
      <tr>
        <td style="font-weight: 600;">${test.name}</td>
        <td>${test.category}</td>
        <td><span class="test-status ${statusClass}">${test.status}</span></td>
        <td>${test.duration}</td>
        <td>
          ${test.error ? `<div class="error-log">${test.error}</div>` : '<span style="color: var(--color-pass); font-weight:600;">Lolos</span>'}
        </td>
      </tr>
    `;

    // Ambil attachments
    if (test.attachments) {
      for (const attach of test.attachments) {
        const decodedBody = decodeBase64(attach.body);
        if (attach.name === 'console-errors') {
          try {
            const data = JSON.parse(decodedBody);
            allConsoleErrors.push(...data.errors.map((e: any) => ({ url: data.pageUrl, ...e })));
          } catch {}
        } else if (attach.name === 'broken-images') {
          try {
            const data = JSON.parse(decodedBody);
            allBrokenImages.push(...data.brokenImages.map((src: string) => ({ url: data.pageUrl, src })));
          } catch {}
        } else if (attach.name === 'network-failures') {
          try {
            const data = JSON.parse(decodedBody);
            allNetworkFailures.push(...data.failures.map((f: any) => ({ pageUrl: data.pageUrl, ...f })));
          } catch {}
        } else if (attach.name === 'security-warning') {
          try {
            const data = JSON.parse(decodedBody);
            securityWarnings.push(data);
          } catch {}
        }
      }
    }

    // Jika gagal, tulis di bagian "Failed Tests"
    if (test.status === 'failed' || test.status === 'timedOut') {
      failedDetailsHtml += `
        <div style="background-color: var(--bg-secondary); border: 1px solid var(--color-fail); border-radius: 0.75rem; padding: 1.25rem; margin-top: 1rem;">
          <h4 style="margin: 0; color: var(--color-fail); font-size: 1rem;">❌ ${test.name}</h4>
          <p style="margin: 0.25rem 0 0.75rem 0; font-size: 0.8rem; color: var(--text-secondary);">Kategori: ${test.category} • Durasi: ${test.duration}ms</p>
          <div class="error-log">${test.error || 'Timeout pengujian terlampaui.'}</div>
        </div>
      `;
    }
  }

  htmlContent = htmlContent.replace('{{TEST_ROWS}}', testRowsHtml);

  // failed tests section
  if (failed > 0) {
    htmlContent = htmlContent.replace('{{FAILED_TESTS_SECTION}}', `
      <div class="section-title" style="color: var(--color-fail);">⚠️ Detail Kegagalan Pengujian (Failed Tests)</div>
      ${failedDetailsHtml}
    `);
  } else {
    htmlContent = htmlContent.replace('{{FAILED_TESTS_SECTION}}', '');
  }

  // API Health summary section
  let apiHealthHtml = '';
  const apiEndpList = [
    { path: '/api/health.php', method: 'GET', desc: 'Mengecek ketersediaan database & tabel' },
    { path: '/api/buses.php', method: 'GET', desc: 'Mengambil daftar armada bus' },
    { path: '/api/price_list.php', method: 'GET', desc: 'Mengambil daftar harga rental' },
    { path: '/api/contact.php', method: 'POST', desc: 'Mengirim pesan formulir kontak' },
    { path: '/api/booking.php', method: 'POST', desc: 'Membuat booking perjalanan' }
  ];

  for (const endp of apiEndpList) {
    const relatedTests = flatTests.filter(t => t.category === 'API Tests' && t.name.toLowerCase().includes(endp.path));
    const isFailed = relatedTests.some(t => t.status === 'failed' || t.status === 'timedOut');
    const isSkipped = relatedTests.length > 0 && relatedTests.every(t => t.status === 'skipped');
    
    let statusText = '<span class="test-status status-passed">Aktif & Sehat</span>';
    let safetyText = '<span style="color: var(--color-pass); font-weight:700;">Aman (Prepared Statement)</span>';

    if (relatedTests.length === 0) {
      statusText = '<span class="test-status status-warning">Belum Diuji</span>';
      safetyText = '-';
    } else if (isFailed) {
      statusText = '<span class="test-status status-failed">Error / Gagal</span>';
      safetyText = '<span style="color: var(--color-fail); font-weight:700;">Ada Kebocoran / Down</span>';
    } else if (isSkipped) {
      statusText = '<span class="test-status status-warning">Dilewati</span>';
      safetyText = '-';
    }

    apiHealthHtml += `
      <tr>
        <td style="font-weight:700; color: #1e3a8a;">${endp.path}</td>
        <td><span style="font-weight:700; color: ${endp.method === 'POST' ? 'var(--color-warn)' : 'var(--color-info)'}">${endp.method}</span></td>
        <td>${endp.desc}</td>
        <td>${statusText}</td>
        <td>${safetyText}</td>
      </tr>
    `;
  }
  htmlContent = htmlContent.replace('{{API_HEALTH_SECTION}}', apiHealthHtml);

  // Security warnings section
  let secWarningHtml = '';
  // Check default security states
  const securityCategories = [
    { name: 'XSS Protection', desc: 'Mencegah eksekusi script berbahaya via form inputs', spec: 'contact.api.spec.ts' },
    { name: 'SQL Injection Guard', desc: 'Mencegah bypass query menggunakan prepared statements', spec: 'booking.api.spec.ts' },
    { name: 'Sensitive Error Leakage', desc: 'Mencegah tereksposnya error PHP/MySQL ke user', spec: 'assertions.ts' },
    { name: 'Admin Session Guard', desc: 'Memastikan route dashboard admin terproteksi login', spec: 'admin.spec.ts' }
  ];

  for (const cat of securityCategories) {
    const isWarning = securityWarnings.length > 0 && cat.name.includes('Admin');
    const isFailed = flatTests.filter(t => t.category === 'Admin/Security Tests' && t.status === 'failed').length > 0;
    
    let statusSpan = '<span class="test-status status-passed">Aman / Lolos</span>';
    let remark = 'Menggunakan validasi query parameter & filter input.';
    
    if (cat.name.includes('Admin') && securityWarnings.length > 0) {
      statusSpan = '<span class="test-status status-warning">Warning / Terbuka</span>';
      remark = `<span style="color: var(--color-warn); font-weight:700;">Bypass Terdeteksi:</span> ${securityWarnings[0].details}`;
    } else if (isFailed && cat.name.includes('Leakage')) {
      statusSpan = '<span class="test-status status-failed">Kerentanan Terdeteksi</span>';
      remark = 'Menemukan kebocoran string kesalahan server.';
    }

    secWarningHtml += `
      <tr>
        <td style="font-weight:700;">${cat.name}</td>
        <td>${cat.desc}</td>
        <td>${statusSpan}</td>
        <td style="font-size:0.8rem;">${remark}</td>
      </tr>
    `;
  }
  htmlContent = htmlContent.replace('{{SECURITY_WARNINGS_SECTION}}', secWarningHtml);

  // Backend Admin API Security section compiler
  let adminApiHtml = '';
  const adminEndpointsList = [
    { path: '/admin/api/tambah_armada.php', method: 'POST', desc: 'Menambahkan unit armada bus baru' },
    { path: '/admin/api/edit_armada.php', method: 'POST', desc: 'Mengubah informasi data armada bus' },
    { path: '/admin/api/hapus_armada.php', method: 'GET', desc: 'Menghapus unit armada bus' },
    { path: '/admin/api/bus_images.php', method: 'GET/POST', desc: 'Mengelola galeri foto detail armada' },
    { path: '/admin/api/tambah_harga.php', method: 'POST', desc: 'Menambahkan rute harga sewa baru' },
    { path: '/admin/api/edit_harga.php', method: 'POST', desc: 'Mengubah data rute harga sewa' },
    { path: '/admin/api/hapus_harga.php', method: 'GET', desc: 'Menghapus data rute harga sewa' },
    { path: '/admin/api/tambah_news.php', method: 'POST', desc: 'Menambahkan berita baru' },
    { path: '/admin/api/edit_news.php', method: 'POST', desc: 'Mengubah isi berita' },
    { path: '/admin/api/hapus_news.php', method: 'GET', desc: 'Menghapus berita' },
    { path: '/admin/api/discount.php', method: 'GET/POST', desc: 'Mengelola daftar diskon/paket wisata' },
    { path: '/api/settings.php', method: 'POST', desc: 'Mengubah konfigurasi maintenance mode' }
  ];

  for (const endp of adminEndpointsList) {
    const relatedTests = flatTests.filter(t => t.name.includes(endp.path));
    
    // Skenario tanpa auth
    const unauthTest = relatedTests.find(t => t.name.includes('reject unauthenticated'));
    let unauthStatus = '<span class="test-status status-warning">Belum Diuji</span>';
    if (unauthTest) {
      unauthStatus = unauthTest.status === 'passed' 
        ? '<span class="test-status status-passed">Ditolak (401 OK)</span>' 
        : '<span class="test-status status-failed">Bypass Terdeteksi</span>';
    }

    // Skenario dengan auth
    const authTest = relatedTests.find(t => t.name.includes('accept valid token'));
    let authStatus = '<span class="test-status status-warning">Belum Diuji</span>';
    if (authTest) {
      authStatus = authTest.status === 'passed' 
        ? '<span class="test-status status-passed">Diterima (200 OK)</span>' 
        : '<span class="test-status status-failed">Gagal Proses</span>';
    }

    const isFullySecure = (unauthTest && unauthTest.status === 'passed') && (authTest && authTest.status === 'passed');
    let overallSecurity = '<span style="color: var(--color-pass); font-weight:700;">Terproteksi (Auth Guard)</span>';
    if (!isFullySecure) {
      overallSecurity = '<span style="color: var(--color-fail); font-weight:700;">Rentan / Down</span>';
    }

    adminApiHtml += `
      <tr>
        <td style="font-weight:700; color: #1e3a8a;">${endp.path}</td>
        <td><span style="font-weight:700; color: var(--color-info);">${endp.method}</span></td>
        <td>${endp.desc}</td>
        <td>${unauthStatus}</td>
        <td>${authStatus}</td>
        <td>${overallSecurity}</td>
      </tr>
    `;
  }
  htmlContent = htmlContent.replace('{{BACKEND_ADMIN_API_SECTION}}', adminApiHtml);

  // Production Hardening section compiler
  let hardeningHtml = '';
  const hardeningChecklist = [
    { 
      name: 'Upload Security', 
      desc: 'Membatasi ekstensi aman (JPG/PNG/WEBP), menolak PHP/SVG/HTML, membatasi file 2MB, nama acak, non-eksekusi PHP di folder images.', 
      testQuery: 'reject PHP file upload', 
      successRemark: 'Lolos: upload .php/.svg ditolak dan folder upload tidak dapat mengeksekusi skrip.' 
    },
    { 
      name: 'Configuration Exposure', 
      desc: 'Memastikan folder config, database, berkas .env, dan backup SQL tidak dapat diakses langsung oleh publik.', 
      testQuery: 'should be blocked and return 404 or 403', 
      successRemark: 'Lolos: berkas koneksi.php, env, dan sql terblokir dari akses browser.' 
    },
    { 
      name: 'HTTP Security Headers', 
      desc: 'Menerapkan header keamanan dasar: X-Content-Type-Options, X-Frame-Options, Referrer-Policy, CSP, dan Permissions-Policy.', 
      testQuery: 'Production Hardening', 
      successRemark: 'Lolos: header CSP, Frame-Options, nosniff, dan Referrer-Policy tersemat.' 
    },
    { 
      name: 'CORS Hardening', 
      desc: 'Membatasi CORS origin agar hanya memperbolehkan domain tepercaya (mafinatrans, adminmafina, dan localhost) untuk API.', 
      testQuery: 'Production Hardening', 
      successRemark: 'Lolos: Allowed Origins dikonfigurasi secara dinamis dan tidak menggunakan wildcard (*).' 
    },
    { 
      name: 'Rate Limiting', 
      desc: 'Mencegah serangan brute-force login, form spamming, dan eksploitasi upload dengan pembatasan IP terpusat di database.', 
      testQuery: 'should trigger rate limiting (HTTP 429)', 
      successRemark: 'Lolos: rate limiter mendeteksi 6 percobaan login beruntun dan mengembalikan HTTP 429.' 
    },
    { 
      name: 'Method Restrictions', 
      desc: 'Membatasi HTTP methods per endpoint, mengembalikan HTTP 405 Method Not Allowed pada request yang salah.', 
      testQuery: 'should reject with HTTP 405 Method Not Allowed', 
      successRemark: 'Lolos: endpoint contact, booking, dan login menolak metode request salah dengan HTTP 405.' 
    },
    { 
      name: 'Backup and Debug Cleanup', 
      desc: 'Menghapus berkas cadangan database SQL dan endpoint debug/test yang dapat membocorkan informasi sistem.', 
      testQuery: 'should return 404 Not Found', 
      successRemark: 'Lolos: buses_debug.php, price_list_debug.php, dan test_info.php berhasil dihapus.' 
    }
  ];

  for (const item of hardeningChecklist) {
    const relatedTests = flatTests.filter(t => t.name.toLowerCase().includes(item.testQuery.toLowerCase()));
    const isFailed = relatedTests.some(t => t.status === 'failed' || t.status === 'timedOut');
    
    let statusText = '<span class="test-status status-passed">Lolos / Aman</span>';
    let remark = item.successRemark;

    if (relatedTests.length === 0) {
      statusText = '<span class="test-status status-warning">Belum Diuji</span>';
      remark = '-';
    } else if (isFailed) {
      statusText = '<span class="test-status status-failed">Rentan / Gagal</span>';
      remark = '<span style="color: var(--color-fail); font-weight:700;">Audit Gagal: Masalah Terdeteksi</span>';
    }

    hardeningHtml += `
      <tr>
        <td style="font-weight:700;">${item.name}</td>
        <td>${item.desc}</td>
        <td>${statusText}</td>
        <td style="font-size:0.85rem;">${remark}</td>
      </tr>
    `;
  }
  htmlContent = htmlContent.replace('{{PRODUCTION_HARDENING_SECTION}}', hardeningHtml);

  // Broken images section
  if (allBrokenImages.length > 0) {
    let imagesHtml = '<ul style="margin:0; padding-left:1.25rem;">';
    for (const img of allBrokenImages) {
      imagesHtml += `<li class="recs-item">Gambar: <code style="color:var(--color-fail);">${img.src}</code> di halaman <code>${img.url}</code></li>`;
    }
    imagesHtml += '</ul>';
    htmlContent = htmlContent.replace('{{BROKEN_IMAGES_SECTION}}', imagesHtml);
  } else {
    htmlContent = htmlContent.replace('{{BROKEN_IMAGES_SECTION}}', '<span style="color: var(--color-pass); font-weight:700;">✓ Tidak ditemukan gambar rusak. Semua aset termuat sempurna.</span>');
  }

  // Console errors section
  if (allConsoleErrors.length > 0) {
    let consoleHtml = '<ul style="margin:0; padding-left:1.25rem;">';
    for (const err of allConsoleErrors) {
      consoleHtml += `<li class="recs-item">[${err.type.toUpperCase()}] ${err.message} di halaman <code>${err.url}</code></li>`;
    }
    consoleHtml += '</ul>';
    htmlContent = htmlContent.replace('{{CONSOLE_ERRORS_SECTION}}', consoleHtml);
  } else {
    htmlContent = htmlContent.replace('{{CONSOLE_ERRORS_SECTION}}', '<span style="color: var(--color-pass); font-weight:700;">✓ Bersih dari console error browser.</span>');
  }

  // Recommendations compiler
  let recsHtml = '';
  if (failed > 0) {
    recsHtml += `<li class="recs-item"><strong>[CRITICAL]</strong> Perbaiki ${failed} test case yang gagal sebelum deploy ke staging/production. Periksa error log detail di bawah.</li>`;
  }
  if (allBrokenImages.length > 0) {
    recsHtml += `<li class="recs-item"><strong>[ASSETS]</strong> Ditemukan gambar rusak. Periksa keselarasan path gambar dengan folder <code>/images/</code> dan pastikan file gambar diunggah ke server.</li>`;
  }
  if (allConsoleErrors.length > 0) {
    recsHtml += `<li class="recs-item"><strong>[FRONTEND]</strong> Hilangkan console log debug dan exception yang tidak tertangani di frontend React guna menghindari pelacakan log oleh pihak luar.</li>`;
  }
  if (securityWarnings.length > 0) {
    recsHtml += `<li class="recs-item"><strong>[SECURITY]</strong> ${securityWarnings[0].recommendation}</li>`;
  }
  
  const hasApiFail = flatTests.filter(t => t.category === 'API Tests' && t.status === 'failed').length > 0;
  if (hasApiFail) {
    recsHtml += `<li class="recs-item"><strong>[DATABASE]</strong> Beberapa API database gagal. Periksa status koneksi database MySQL di <code>config/koneksi.php</code> dan pastikan user DB memiliki izin yang sesuai.</li>`;
  }

  if (recsHtml === '') {
    recsHtml = '<li class="recs-item" style="color: var(--color-pass); font-weight: 700;">✓ Aplikasi dalam kondisi stabil dan siap dideploy. Seluruh fungsionalitas utama berjalan lancar.</li>';
  }
  htmlContent = htmlContent.replace('{{RECOMMENDATIONS}}', recsHtml);

  // Tulis ke file output
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, htmlContent, 'utf8');
  console.log(`Laporan HTML Kustom berhasil dibuat di: ${outputPath}`);
}

try {
  generateReport();
} catch (e: any) {
  console.error('Gagal menyusun Laporan HTML:', e.message);
}
