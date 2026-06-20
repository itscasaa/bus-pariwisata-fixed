<?php
// ============================================================
// config/rate_limiter.php
// IP-based rate limiter using MySQL database
// ============================================================

function checkRateLimit($endpoint, $limit, $window) {
    global $conn;

    if (!isset($conn) || !$conn) {
        // Fallback to allow if database connection is not active
        return;
    }

    // Bypass rate limiting for automated QA runs if bypass key is present
    if (isset($_SERVER['HTTP_X_TEST_BYPASS']) && $_SERVER['HTTP_X_TEST_BYPASS'] === 'mafina_qa_bypass_secret_key_2026') {
        return;
    }

    $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
    $now = time();

    // 1. Clean up old entries with 5% probability to prevent table bloat
    if (mt_rand(1, 100) <= 5) {
        mysqli_query($conn, "DELETE FROM rate_limits WHERE last_attempt < " . ($now - 3600));
    }

    try {
        // 2. Fetch current status
        $stmt = mysqli_prepare($conn, "SELECT attempts, last_attempt FROM rate_limits WHERE ip = ? AND endpoint = ? LIMIT 1");
        if ($stmt) {
            mysqli_stmt_bind_param($stmt, 'ss', $ip, $endpoint);
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);
            $row = mysqli_fetch_assoc($result);
            mysqli_stmt_close($stmt);

            if ($row) {
                $attempts = (int)$row['attempts'];
                $last_attempt = (int)$row['last_attempt'];

                if (($now - $last_attempt) > $window) {
                    // Window passed, reset attempts
                    $stmtUpdate = mysqli_prepare($conn, "UPDATE rate_limits SET attempts = 1, last_attempt = ? WHERE ip = ? AND endpoint = ?");
                    if ($stmtUpdate) {
                        mysqli_stmt_bind_param($stmtUpdate, 'iss', $now, $ip, $endpoint);
                        mysqli_stmt_execute($stmtUpdate);
                        mysqli_stmt_close($stmtUpdate);
                    }
                } else {
                    if ($attempts >= $limit) {
                        // Rate limit exceeded!
                        http_response_code(429);
                        header('Content-Type: application/json; charset=utf-8');
                        echo json_encode([
                            'success' => false,
                            'status' => 'error',
                            'message' => 'Too many requests. Please try again later.'
                        ], JSON_UNESCAPED_UNICODE);
                        exit;
                    } else {
                        // Increment attempts
                        $stmtUpdate = mysqli_prepare($conn, "UPDATE rate_limits SET attempts = attempts + 1 WHERE ip = ? AND endpoint = ?");
                        if ($stmtUpdate) {
                            mysqli_stmt_bind_param($stmtUpdate, 'ss', $ip, $endpoint);
                            mysqli_stmt_execute($stmtUpdate);
                            mysqli_stmt_close($stmtUpdate);
                        }
                    }
                }
            } else {
                // Insert first attempt
                $stmtInsert = mysqli_prepare($conn, "INSERT INTO rate_limits (ip, endpoint, attempts, last_attempt) VALUES (?, ?, 1, ?)");
                if ($stmtInsert) {
                    mysqli_stmt_bind_param($stmtInsert, 'ssi', $ip, $endpoint, $now);
                    mysqli_stmt_execute($stmtInsert);
                    mysqli_stmt_close($stmtInsert);
                }
            }
        }
    } catch (Exception $e) {
        // Fail open in case of database issues
    }
}
?>
