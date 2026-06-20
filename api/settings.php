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
mysqli_query($conn, $create_query);

// Seed defaults
$defaults = [
    'maintenance_mode' => '0',
    'maintenance_message' => 'Website sedang dalam pemeliharaan berkala untuk meningkatkan layanan kami. Silakan hubungi kami via WhatsApp untuk info pemesanan.'
];

foreach ($defaults as $key => $val) {
    $stmt = mysqli_prepare($conn, "SELECT 1 FROM settings WHERE setting_key = ?");
    mysqli_stmt_bind_param($stmt, 's', $key);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_store_result($stmt);
    if (mysqli_stmt_num_rows($stmt) === 0) {
        $inst = mysqli_prepare($conn, "INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)");
        mysqli_stmt_bind_param($inst, 'ss', $key, $val);
        mysqli_stmt_execute($inst);
        mysqli_stmt_close($inst);
    }
    mysqli_stmt_close($stmt);
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $result = mysqli_query($conn, "SELECT setting_key, setting_value FROM settings");
        $settings = [];
        while ($row = mysqli_fetch_assoc($result)) {
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
            $stmt = mysqli_prepare($conn, "UPDATE settings SET setting_value = ? WHERE setting_key = 'maintenance_mode'");
            mysqli_stmt_bind_param($stmt, 's', $mode);
            mysqli_stmt_execute($stmt);
            mysqli_stmt_close($stmt);
        }

        if (isset($input['maintenance_message'])) {
            $message = trim($input['maintenance_message']);
            $stmt = mysqli_prepare($conn, "UPDATE settings SET setting_value = ? WHERE setting_key = 'maintenance_message'");
            mysqli_stmt_bind_param($stmt, 's', $message);
            mysqli_stmt_execute($stmt);
            mysqli_stmt_close($stmt);
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
