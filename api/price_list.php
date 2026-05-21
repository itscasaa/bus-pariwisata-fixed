<?php
/**
 * API: Get Price List
 * Endpoint: GET /api/price_list.php
 * Query Parameters: keyword (optional) - search destination by name
 * Returns: Price list by destination, optionally filtered
 * Response Format: {status: "success"|"error", message: "", data: [{id, nama_destinasi, harga_hiace, harga_elf, harga_medium, harga_big}, ...]}
 */

// Production error handling
error_reporting(0);
ini_set('display_errors', 0);

// Set response headers
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

// Initialize response structure
$response = [
  'status' => 'error',
  'message' => '',
  'data' => []
];

// Include database connection
include_once '../config/koneksi.php';

// Validate database connection
if (!isset($conn) || !$conn) {
  http_response_code(503);
  $response['message'] = 'Database connection not available.';
  echo json_encode($response, JSON_UNESCAPED_UNICODE);
  exit;
}

// Validate request method
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
  http_response_code(405);
  $response['message'] = 'Only GET method is allowed.';
  echo json_encode($response, JSON_UNESCAPED_UNICODE);
  exit;
}

try {
  // Get and sanitize keyword parameter
  $keyword = isset($_GET['keyword']) ? trim($_GET['keyword']) : '';
  
  $prices = [];

  if ($keyword !== '') {
    // Search with keyword using prepared statement (safe from SQL injection)
    $keywordLike = '%' . $keyword . '%';
    
    // Prepare statement
    $stmt = mysqli_prepare($conn, "SELECT id, nama_destinasi, durasi, harga_hiace, harga_elf, harga_medium, harga_big FROM price_list WHERE nama_destinasi LIKE ? ORDER BY nama_destinasi ASC");
    
    if ($stmt === false) {
      throw new Exception('Failed to prepare statement: ' . mysqli_error($conn));
    }

    // Bind parameter
    if (!mysqli_stmt_bind_param($stmt, 's', $keywordLike)) {
      throw new Exception('Failed to bind parameters: ' . mysqli_stmt_error($stmt));
    }

    // Execute statement
    if (!mysqli_stmt_execute($stmt)) {
      throw new Exception('Failed to execute query: ' . mysqli_stmt_error($stmt));
    }

    // Get result
    $result = mysqli_stmt_get_result($stmt);
    if ($result === false) {
      throw new Exception('Failed to get result: ' . mysqli_stmt_error($stmt));
    }

    // Fetch all results
    while ($data = mysqli_fetch_assoc($result)) {
      $prices[] = [
        'id' => (int)$data['id'],
        'nama_destinasi' => (string)$data['nama_destinasi'],
        'durasi' => (string)$data['durasi'],
        'harga_hiace' => (int)$data['harga_hiace'],
        'harga_elf' => (int)$data['harga_elf'],
        'harga_medium' => (int)$data['harga_medium'],
        'harga_big' => (int)$data['harga_big']
      ];
    }

    // Close statement
    mysqli_stmt_close($stmt);

  } else {
    // Get all price list without filter
    $query = mysqli_query($conn, "SELECT id, nama_destinasi, durasi, harga_hiace, harga_elf, harga_medium, harga_big FROM price_list ORDER BY id ASC");

    if ($query === false) {
      throw new Exception('Database query failed: ' . mysqli_error($conn));
    }

    // Fetch all results
    while ($data = mysqli_fetch_assoc($query)) {
      $prices[] = [
        'id' => (int)$data['id'],
        'nama_destinasi' => (string)$data['nama_destinasi'],
        'durasi' => (string)$data['durasi'],
        'harga_hiace' => (int)$data['harga_hiace'],
        'harga_elf' => (int)$data['harga_elf'],
        'harga_medium' => (int)$data['harga_medium'],
        'harga_big' => (int)$data['harga_big']
      ];
    }
  }

  // Return success response
  http_response_code(200);
  $response['status'] = 'success';
  $response['message'] = '';
  $response['data'] = $prices;

} catch (Exception $e) {
  // Handle exceptions gracefully
  http_response_code(500);
  $response['status'] = 'error';
  $response['message'] = 'Internal server error: ' . $e->getMessage();
  $response['data'] = [];
}

// Return JSON response with UTF-8 encoding
echo json_encode($response, JSON_UNESCAPED_UNICODE);

// Close database connection safely
if (isset($conn) && is_object($conn)) {
  mysqli_close($conn);
}
?>
