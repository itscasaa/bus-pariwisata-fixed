# Requirements Document

## Introduction

This feature fixes backend, API, database, admin panel, image path, and deployment issues for the **Surya Tour Trans** project — a React frontend + PHP API + MySQL application located at `c:\xampp\htdocs\bus_pariwisata` and deployed on InfinityFree (`https://testingbuspariwisata.infinityfreeapp.com`).

The core defect: the API returns bus and destination image URLs such as `https://.../images/bus1/bu1.jpeg`, but the production server only finds images under `htdocs/frontend/assets/images/` while the public web path must be `/images/...`. As a result, image requests return HTTP 404. Related problems include an unverified `paket_wisata` endpoint, a `news` endpoint that can fail instead of returning empty data, admin/database configuration that must work across local XAMPP, InfinityFree, and VPS environments, missing or inconsistent rewrite rules, and deployment documentation that must make the image-location requirement unmissable.

**Hard constraint (applies to every requirement):** The frontend UI design MUST NOT be changed. Layout, color scheme, card style, navbar, animations, and typography are out of scope. Only backend code, API behavior, database configuration, admin panel functionality, image file locations/paths, and deployment files may be modified. The only permitted frontend change is the non-visual API base URL configuration in `frontend/src/config/api.js` (Requirement 9).

This spec is grounded in the current codebase. Notable starting points discovered during analysis:
- A root `images/` folder already exists alongside `frontend/assets/images/`; both contain `bus1`..`bus11` and `destinasi`.
- `api/buses.php` already contains a `normalizeImagePath()` function, but its prefix-stripping list differs from the target specification.
- `api/paket_wisata.php` already queries `paket_wisata` and excludes bus fields, but does not normalize the `gambar` path.
- `api/news.php` exists but queries `slug`/`status` columns, filters on `status='publish'`, and returns HTTP 500 (not empty data) when the table is missing.
- Admin login already uses `admin_users` + `password_verify`; `database/setup.sql` already seeds the bcrypt hash for `admin123`.
- `config/koneksi.php` is centralized with environment-variable support; `admin/config.php` already includes it.
- `frontend/src/config/api.js` currently selects the base URL using `NODE_ENV` rather than the hostname check requested in Task 9.

## Glossary

- **STT_System**: The complete Surya Tour Trans application (React frontend build, PHP API, admin panel, and MySQL database).
- **Buses_API**: The PHP endpoint `api/buses.php` that returns bus (armada) records as JSON.
- **Paket_API**: The PHP endpoint `api/paket_wisata.php` that returns tour package / destination records as JSON.
- **News_API**: The PHP endpoint `api/news.php` that returns news records as JSON.
- **Health_API**: The PHP endpoint `api/health.php` that reports database connectivity and table availability.
- **Image_Normalizer**: The `normalizeImagePath($path)` PHP function responsible for converting any stored or hard-coded image path into a canonical public web path beginning with `/images/`.
- **DB_Config**: The single database connection file `config/koneksi.php`.
- **Admin_Config**: The admin bootstrap file `admin/config.php`.
- **Admin_Login**: The admin authentication page `admin/index.php`.
- **Admin_Panel**: The set of PHP pages under `admin/` used to manage content.
- **Setup_SQL**: The database schema-and-seed file `database/setup.sql`.
- **Root_Htaccess**: The Apache configuration file at the web root, `.htaccess`.
- **Api_Htaccess**: The Apache configuration file at `api/.htaccess`.
- **Frontend_Api_Config**: The non-visual configuration module `frontend/src/config/api.js` that defines the API base URL.
- **Deploy_Doc**: The deployment documentation file `DEPLOY.md`.
- **Canonical_Image_Path**: A path of the exact form `/images/<subpath>` (forward slashes, single leading slash, no protocol, no host, no `frontend/assets/` segment).
- **Local_Image_Root**: The project-root folder `images/` that mirrors the image content of `frontend/assets/images/`.

## Requirements

### Requirement 1: Local project image structure

**User Story:** As a developer preparing a deployment, I want all image files available under a root `images/` folder, so that the public path `/images/...` resolves to real files both locally and in production.

#### Acceptance Criteria

1. WHERE the folder `frontend/assets/images/` exists, THE STT_System SHALL ensure every file and subfolder under `frontend/assets/images/` also exists under the root `images/` folder at the same relative subpath.
2. THE STT_System SHALL preserve the existing `frontend/assets/images/` folder and its contents without deletion.
3. WHEN the image copy operation completes, THE STT_System SHALL provide `images/bus1` through `images/bus11` and `images/destinasi` containing the same files as their `frontend/assets/images/` counterparts.
4. IF a file already exists at the destination under `images/` with identical content, THEN THE STT_System SHALL leave the destination file unchanged.

### Requirement 2: Bus API image path normalization

**User Story:** As a frontend consumer of the bus data, I want every bus image path returned as a canonical `/images/...` path, so that images load without 404 errors in production.

#### Acceptance Criteria

1. THE Image_Normalizer SHALL accept a single string path argument and return a Canonical_Image_Path.
2. WHEN the input path contains backslashes, THE Image_Normalizer SHALL replace each backslash with a forward slash.
3. WHEN the input path begins with a protocol-and-host prefix matching `^https?://[^/]+/`, THE Image_Normalizer SHALL remove that prefix.
4. WHEN the input path contains any of the segments `/frontend/assets/images/`, `frontend/assets/images/`, `/assets/images/`, `assets/images/`, `/images/`, or `images/`, THE Image_Normalizer SHALL strip that segment and all preceding characters.
5. THE Image_Normalizer SHALL remove leading `/` characters from the remaining path before composing the result.
6. THE Image_Normalizer SHALL return the string `/images/` concatenated with the remaining relative path.
7. WHEN the Buses_API returns a bus record, THE Buses_API SHALL apply the Image_Normalizer to the main bus image, the `gambar` field, the `gambar_utama` field, and each `bus_images` path.
8. WHEN the Buses_API returns a bus record, THE Buses_API SHALL set `gambar` and `gambar_utama` to the same Canonical_Image_Path (for example `/images/bus1/bu1.jpeg`).
9. THE Buses_API SHALL NOT return any image value containing `/frontend/assets/images/`, `localhost`, `C:/xampp`, or `../frontend`.

### Requirement 3: Paket Wisata API correctness

**User Story:** As a frontend consumer of tour package data, I want the package endpoint to return destination fields with normalized image paths, so that the Paket Wisata page shows correct data and images.

#### Acceptance Criteria

1. THE Paket_API SHALL query the `paket_wisata` table and SHALL NOT query the `bus` table.
2. WHEN the Paket_API returns a package record, THE Paket_API SHALL include the fields `id`, `judul`, `badge`, `kategori`, `durasi`, `harga`, `harga_fmt`, `deskripsi`, `gambar`, `status`, `urutan`, and `created_at`.
3. THE Paket_API SHALL NOT include the fields `nama_bus`, `tipe`, `kapasitas`, or `harga_sewa` in any returned record.
4. WHEN the Paket_API lists all active packages, THE Paket_API SHALL execute the query `SELECT id, judul, badge, kategori, durasi, harga, deskripsi, gambar, status, urutan, created_at FROM paket_wisata WHERE status = 'aktif' ORDER BY urutan ASC, id ASC`.
5. WHEN the Paket_API returns a package record, THE Paket_API SHALL return the `gambar` field as a Canonical_Image_Path of the form `/images/destinasi/<file-name>`.
6. THE Paket_API SHALL format `harga_fmt` as the value `Rp. ` followed by the `harga` integer grouped with `.` as the thousands separator.

### Requirement 4: News API availability

**User Story:** As a frontend consumer of news data, I want the news endpoint to always return JSON with a consistent record shape, so that the UI never receives a 404 or HTML error when news is unavailable and never breaks on a missing `ringkas` field.

#### Acceptance Criteria

1. THE News_API SHALL exist at `api/news.php` and SHALL respond with `Content-Type: application/json`.
2. WHEN the `news` table exists, THE News_API SHALL detect whether the `news` table has a `ringkas` column before building its query, and SHALL NOT require or create a `ringkas` column as a precondition for returning data.
3. WHERE the `news` table has a `ringkas` column, THE News_API SHALL select `ringkas` from the table and return its stored value as-is in each record.
4. WHERE the `news` table does NOT have a `ringkas` column, THE News_API SHALL derive the `ringkas` value at runtime from `konten` using `strip_tags(konten)` truncated to approximately 150–180 characters, without altering the `news` table structure.
5. WHEN the News_API returns a news record, THE News_API SHALL always include a `ringkas` field in that record regardless of whether the column exists.
6. WHEN the News_API lists all news, THE News_API SHALL order the results by `created_at DESC, id DESC` and return the rows in the `data` array.
7. THE News_API SHALL return a JSON object containing the keys `status`, `message`, and `data`.
8. IF the `news` table does not exist, THEN THE News_API SHALL return a JSON object with an empty `data` array and SHALL NOT return HTTP 404 or HTML content.
9. WHEN the News_API completes successfully, THE News_API SHALL set `status` to `success`.
10. THE News_API SHALL NOT force a database migration and SHALL NOT break or alter the existing `news` table structure in order to provide the `ringkas` field.

### Requirement 5: Admin login authentication

**User Story:** As an administrator, I want to log into the admin panel with a username and password, so that I can manage site content securely.

#### Acceptance Criteria

1. THE Admin_Login SHALL authenticate against the `admin_users` table containing the columns `id`, `nama`, `username`, `password`, and `created_at`.
2. WHEN an administrator submits a username and password, THE Admin_Login SHALL verify the password using `password_verify($input_password, $row['password'])`.
3. IF the submitted username is not found or `password_verify` returns false, THEN THE Admin_Login SHALL reject the login and display an authentication error message.
4. WHEN authentication succeeds, THE Admin_Login SHALL establish an authenticated admin session and redirect to the dashboard.
5. THE Setup_SQL SHALL create the `admin_users` table and insert a default administrator with `username` = `admin` and a bcrypt password hash that verifies against `admin123`.
6. THE Setup_SQL SHALL store the default administrator password only as a bcrypt hash and SHALL NOT store it as plain text.

### Requirement 6: Admin content management pages

**User Story:** As an administrator, I want pages to manage tour packages and view incoming messages, so that I can maintain destination content and respond to customer inquiries.

#### Acceptance Criteria

1. THE Admin_Panel SHALL provide a page `admin/paket_wisata.php` that lists records from the `paket_wisata` table.
2. THE `admin/paket_wisata.php` page SHALL support adding, editing, and deleting `paket_wisata` records, setting status to `aktif` or `nonaktif`, and entering an image path field.
3. THE Admin_Panel SHALL provide a page `admin/pesan.php` that displays messages from the `pesan_masuk` table.
4. THE Admin_Panel SHALL follow the existing admin visual style and SHALL NOT introduce a redesigned admin UI.
5. THE `admin/layout_header.php` sidebar SHALL provide navigation links for Dashboard, Armada, Paket Wisata, Price List, News, Pesan Masuk, and Logout.

### Requirement 7: Centralized database connection

**User Story:** As a developer deploying across multiple environments, I want a single database connection file that adapts to each environment, so that credentials are defined in exactly one place.

#### Acceptance Criteria

1. THE DB_Config SHALL be the only file in the project that establishes the MySQL database connection.
2. WHERE the environment variables `DB_HOST`, `DB_USER`, `DB_PASS`, and `DB_NAME` are available, THE DB_Config SHALL use their values for the connection.
3. WHERE the environment variables are not available, THE DB_Config SHALL use fallback configuration values for local XAMPP, InfinityFree, and VPS environments.
4. THE Admin_Config SHALL obtain its database connection by including `../config/koneksi.php` and SHALL NOT define duplicate database credentials.

### Requirement 8: Apache rewrite configuration

**User Story:** As a site operator, I want correct rewrite rules at the web root and API folder, so that React routing works while API, admin, images, config, and database paths are served directly.

#### Acceptance Criteria

1. THE Root_Htaccess SHALL enable the rewrite engine with `RewriteEngine On`.
2. WHEN a requested path matches an existing file or directory, THE Root_Htaccess SHALL serve it directly using the conditions `RewriteCond %{REQUEST_FILENAME} -f [OR]`, `RewriteCond %{REQUEST_FILENAME} -d`, and the rule `RewriteRule ^ - [L]`.
3. WHEN a requested path begins with `api/`, `admin/`, `images/`, `config/`, or `database/`, THE Root_Htaccess SHALL serve it directly using the rule `RewriteRule ^(api|admin|images|config|database)/ - [L]`.
4. WHEN a requested path matches none of the direct-serve conditions, THE Root_Htaccess SHALL rewrite the request to `/index.html` using the rule `RewriteRule . /index.html [L]`.
5. THE Api_Htaccess SHALL disable rewriting with `RewriteEngine Off`.
6. IF the hosting environment rejects additional directives in the Api_Htaccess, THEN THE Api_Htaccess SHALL retain only the `RewriteEngine Off` directive.

### Requirement 9: Flexible frontend API base configuration

**User Story:** As a developer, I want the frontend API base URL to adapt to local and production environments without changing the UI, so that the same build configuration works everywhere.

#### Acceptance Criteria

1. THE Frontend_Api_Config SHALL define the API base URL as `process.env.REACT_APP_API_BASE_URL || (window.location.hostname === "localhost" ? "http://localhost/bus_pariwisata/api" : "/api")` and export it as the default export.
2. WHERE the build system differs from the assumed configuration, THE Frontend_Api_Config SHALL adapt the same selection logic to the project's existing build system.
3. THE STT_System SHALL NOT alter any frontend UI layout, color, card style, navbar, animation, or typography as part of changing the Frontend_Api_Config.

### Requirement 10: Deployment documentation

**User Story:** As a developer deploying to InfinityFree, I want exact upload instructions, so that all assets including images land in the correct server folders.

#### Acceptance Criteria

1. THE Deploy_Doc SHALL provide InfinityFree upload instructions that place the frontend build output into `htdocs/`.
2. THE Deploy_Doc SHALL instruct uploading the backend folders to `htdocs/api`, `htdocs/admin`, `htdocs/config`, `htdocs/images`, and `htdocs/database`, plus the `.htaccess` file.
3. THE Deploy_Doc SHALL state that image files must be uploaded to `htdocs/images/` and SHALL warn against placing them only in `htdocs/frontend/assets/images/`.

### Requirement 11: End-to-end success verification

**User Story:** As a site operator, I want a verifiable set of success checks, so that I can confirm the deployment is functioning correctly.

#### Acceptance Criteria

1. WHEN the URL `/images/bus1/bu1.jpeg` is requested, THE STT_System SHALL return the corresponding image file.
2. WHEN `/api/buses.php` is requested, THE Buses_API SHALL return bus data whose image paths are Canonical_Image_Paths beginning with `/images/`.
3. WHEN `/api/paket_wisata.php` is requested, THE Paket_API SHALL return destination data that includes a `judul` field.
4. WHEN `/api/paket_wisata.php` is requested, THE Paket_API SHALL return data that does not include a `nama_bus` field.
5. WHEN `/api/news.php` is requested, THE News_API SHALL return JSON and SHALL NOT return HTTP 404.
6. WHEN `/api/health.php` is requested with a reachable database, THE Health_API SHALL report the database status as `connected`.
7. WHEN an administrator submits valid credentials to the Admin_Login, THE Admin_Login SHALL grant access to the admin dashboard.
