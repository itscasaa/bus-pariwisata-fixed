# Implementation Plan: Surya Tour Trans Backend Fixes (MVP)

## Overview

This is a simplified, MVP-focused plan that prioritizes ONLY the core functional fixes needed to get the live site working. All automated testing (Composer/PHPUnit/Eris setup, property-based tests, unit/integration/smoke/static tests) is intentionally deferred and excluded from this plan — verification is done by manual spot-checks at checkpoints.

Work order follows urgency: first the canonical image-path normalizer (single source of truth) shared by the bus and package endpoints, then the verify/sync of the root `images/` folder, then the three API endpoints (`buses.php`, `paket_wisata.php`, `news.php`), then admin login and admin content pages, then the Apache rewrite rules, then deployment docs. Each step builds on the previous one. The frontend UI is never modified; nothing is redesigned — only backend functionality is fixed.

## Tasks

- [ ] 1. Image-path foundation
  - [ ] 1.1 Define the canonical image-path normalizer (shared algorithm)
    - In `api/buses.php` and `api/paket_wisata.php`, define `normalizeImagePath(?string $path): string` as a byte-for-byte identical copy of one canonical algorithm
    - Algorithm: null/empty → `''`; trim; convert `\` to `/`; strip a leading `^https?://[^/]+/` host prefix; find the first of the segments `/frontend/assets/images/`, `frontend/assets/images/`, `/assets/images/`, `assets/images/`, `/images/`, `images/` and discard that segment and everything before it; strip remaining leading `/`; return `'/images/' . <residual>`
    - Ensure production output never contains `/frontend/assets/images/`, `localhost`, `C:/xampp`, or `../frontend`, and always begins with a single `/images/` prefix
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

  - [ ] 1.2 Verify and sync the root `images/` folder
    - Write an idempotent PHP sync script that copies every file/subfolder from `frontend/assets/images/<subpath>` to `images/<subpath>` only when the destination is missing or differs
    - Never delete or move `frontend/assets/images/`; leave identical destination files untouched
    - Run it so `images/bus1`..`images/bus11` and `images/destinasi` exist and mirror their `frontend/assets/images/` counterparts
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 2. Fix API endpoints
  - [ ] 2.1 Fix `api/buses.php` image fields
    - Ensure the endpoint returns bus data with the standard `{ status, message, data }` envelope (list mode + `?id=` mode)
    - Apply `normalizeImagePath()` so `gambar` and `gambar_utama` are set to the same Canonical_Image_Path (e.g. `/images/bus1/bu1.jpeg`)
    - Apply `normalizeImagePath()` to every `bus_images[].path` so each also points to `/images/...`
    - Ensure no returned image value contains `/frontend/assets/images/`, `localhost`, `C:/xampp`, or `../frontend`
    - _Requirements: 2.7, 2.8, 2.9_

  - [ ] 2.2 Fix `api/paket_wisata.php` query and record shape
    - Query the `paket_wisata` table (never the `bus` table) using `SELECT id, judul, badge, kategori, durasi, harga, deskripsi, gambar, status, urutan, created_at FROM paket_wisata WHERE status = 'aktif' ORDER BY urutan ASC, id ASC`
    - Shape each record to exactly `id, judul, badge, kategori, durasi, harga, harga_fmt, deskripsi, gambar, status, urutan, created_at` and exclude `nama_bus`, `tipe`, `kapasitas`, `harga_sewa`
    - Normalize `gambar` via `normalizeImagePath()` to `/images/destinasi/<file>`, and format `harga_fmt` as `'Rp. ' . number_format((int)$harga, 0, ',', '.')`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [ ] 2.3 Fix `api/news.php` to always return JSON with `ringkas`
    - Always respond `Content-Type: application/json` with the `{ status, message, data }` envelope and `status='success'` on completion
    - Add `tableExists()` (`SHOW TABLES LIKE 'news'`); if the `news` table is missing, return HTTP 200 with empty `data` — never 404 or HTML
    - Add `hasColumn()` (`SHOW COLUMNS FROM news LIKE 'ringkas'`); build the SELECT with or without `ringkas`, ordered by `created_at DESC, id DESC`; issue no DDL/migration
    - When the `ringkas` column is absent, derive `ringkas` from `strip_tags(konten)` truncated to ~150–180 chars; always include a string `ringkas` field per record
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 4.10_

- [ ] 3. Checkpoint - Manual verification of APIs
  - Manually spot-check `/api/buses.php`, `/api/paket_wisata.php`, and `/api/news.php` (browser or curl): confirm image paths begin with `/images/`, paket excludes bus fields, and news returns JSON. Ask the user if questions arise.

- [ ] 4. Verify admin panel
  - [ ] 4.1 Verify admin login and bcrypt seed
    - Confirm `admin/index.php` authenticates against `admin_users (id, nama, username, password, created_at)`, verifies with `password_verify($input, $row['password'])`, sets the admin session and redirects to the dashboard on success, and shows an inline error on failure; adjust if any deviation
    - Confirm `database/setup.sql` creates `admin_users` and seeds `admin` with a bcrypt hash that verifies `admin123` (never plain text); adjust the seed if needed
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

  - [ ] 4.2 Verify admin content pages and sidebar links
    - Confirm `admin/paket_wisata.php` exists and lists/adds/edits/deletes `paket_wisata` with `aktif|nonaktif` status and an image-path field
    - Confirm `admin/pesan.php` exists and lists `pesan_masuk`
    - Confirm the `admin/layout_header.php` sidebar includes links for Dashboard, Armada, Paket Wisata, Price List, News, Pesan Masuk, and Logout; keep the existing admin visual style (no redesign)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 5. Verify routing and deployment docs
  - [ ] 5.1 Verify the root `.htaccess` rewrite rules
    - Confirm `RewriteEngine On`, the existing-file/dir direct-serve conditions, the direct-serve rule `RewriteRule ^(api|admin|images|config|database)/ - [L]` so `/api`, `/admin`, and `/images` are NOT rewritten to React's `index.html`, and the SPA fallback `RewriteRule . /index.html [L]` for all other routes
    - Confirm `api/.htaccess` has `RewriteEngine Off` (reduce to only that directive if the host rejects extras)
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

  - [ ] 5.2 Update `DEPLOY.md` upload instructions
    - Document placing the frontend build output into `htdocs/` and uploading backend folders to `htdocs/api`, `htdocs/admin`, `htdocs/config`, `htdocs/images`, `htdocs/database`, plus the `.htaccess` file
    - Explicitly state that image files must be uploaded to `htdocs/images/` and warn against placing them only in `htdocs/frontend/assets/images/`
    - _Requirements: 10.1, 10.2, 10.3_

- [ ] 6. Final checkpoint - Manual verification of the live fixes
  - Manually verify the full path on the target host: `/images/bus1/bu1.jpeg` loads, the three APIs return correct JSON, admin login works with `admin/admin123`. Ask the user if questions arise.

## Notes

- This is a deliberately reduced MVP scope: all automated tests (property-based, unit, integration, smoke, static/config) and the testing-framework setup are deferred for now and should be added back once the live-site issues are resolved.
- Deferred for later (not in this MVP): the centralized DB-config confirmation (Requirement 7), the frontend `api.js` base-URL change (Requirement 9), and the end-to-end automated verification suite (Requirement 11).
- The image-path normalizer is the single source of truth; its implementation in `api/buses.php` and `api/paket_wisata.php` must be byte-for-byte identical.
- Each task references specific requirements for traceability.
- Checkpoints are manual spot-checks (browser/curl), not automated test runs.
- The frontend UI is never modified; nothing is redesigned — only backend functionality is fixed.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "2.3", "4.1", "4.2", "5.1", "5.2"] },
    { "id": 1, "tasks": ["2.1", "2.2"] }
  ]
}
```
