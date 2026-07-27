<?php
/**
 * API: Settings (Maintenance Mode)
 * 
 * GET  /api/settings.php              → Get maintenance mode settings
 * POST /api/settings.php              → Update settings (Admin access required)
 */

error_reporting(0);
ini_set('display_errors', 0);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$response = ['status' => 'error', 'message' => '', 'data' => []];

include_once __DIR__ . '/../config/koneksi.php';

if (!isset($conn) || !$conn) {
    http_response_code(503);
    $response['message'] = 'Database connection not available.';
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    exit;
}

// Ensure settings table exists (self-healing)
$create_query = "CREATE TABLE IF NOT EXISTS settings (
    setting_key   VARCHAR(50)  NOT NULL PRIMARY KEY,
    setting_value TEXT         NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
db_query($conn, $create_query);

// Seed defaults
$defaults = [
    'maintenance_mode' => '0',
    'maintenance_message' => 'Website sedang dalam pemeliharaan berkala untuk meningkatkan layanan kami. Silakan hubungi kami via WhatsApp untuk info pemesanan.'
];

foreach ($defaults as $key => $val) {
    $stmt = db_prepare($conn, "SELECT 1 FROM settings WHERE setting_key = ?");
    db_stmt_bind_param($stmt, 's', $key);
    db_stmt_execute($stmt);
    db_stmt_store_result($stmt);
    if (db_stmt_num_rows($stmt) === 0) {
        $inst = db_prepare($conn, "INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)");
        db_stmt_bind_param($inst, 'ss', $key, $val);
        db_stmt_execute($inst);
        db_stmt_close($inst);
    }
    db_stmt_close($stmt);
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $result = db_query($conn, "SELECT setting_key, setting_value FROM settings");
        $settings = [];
        while ($row = db_fetch_assoc($result)) {
            $settings[$row['setting_key']] = $row['setting_value'];
        }
        
        http_response_code(200);
        $response['status'] = 'success';
        $response['data'] = [
            'maintenance_mode' => (int)($settings['maintenance_mode'] ?? 0) === 1,
            'maintenance_message' => (string)($settings['maintenance_message'] ?? '')
        ];
    } catch (Exception $e) {
        http_response_code(500);
        $response['message'] = 'Failed to load settings: ' . $e->getMessage();
    }
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    exit;
}

if ($method === 'POST') {
    // Session & Token validation via auth guard
    require_once __DIR__ . '/../config/auth_guard.php';

    require_once __DIR__ . '/../config/rate_limiter.php';
    checkRateLimit('settings', 5, 60);

    try {
        // Parse input body
        $input = json_decode(file_get_contents('php://input'), true);
        if ($input === null) {
            $input = $_POST;
        }

        if (isset($input['maintenance_mode'])) {
            $mode = ($input['maintenance_mode'] === true || $input['maintenance_mode'] == 1) ? '1' : '0';
            $stmt = db_prepare($conn, "UPDATE settings SET setting_value = ? WHERE setting_key = 'maintenance_mode'");
            db_stmt_bind_param($stmt, 's', $mode);
            db_stmt_execute($stmt);
            db_stmt_close($stmt);
        }

        if (isset($input['maintenance_message'])) {
            $message = trim($input['maintenance_message']);
            $stmt = db_prepare($conn, "UPDATE settings SET setting_value = ? WHERE setting_key = 'maintenance_message'");
            db_stmt_bind_param($stmt, 's', $message);
            db_stmt_execute($stmt);
            db_stmt_close($stmt);
        }

        http_response_code(200);
        $response['status'] = 'success';
        $response['message'] = 'Pengaturan berhasil diperbarui.';
    } catch (Exception $e) {
        http_response_code(500);
        $response['message'] = 'Gagal menyimpan pengaturan: ' . $e->getMessage();
    }
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    exit;
}

http_response_code(405);
$response['message'] = 'Method not allowed.';
echo json_encode($response, JSON_UNESCAPED_UNICODE);
?>
