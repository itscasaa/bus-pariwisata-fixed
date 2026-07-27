<?php
// ============================================================
// config/koneksi.php
// Konfigurasi database terpusat - Diperbarui untuk PostgreSQL (PDO)
// ============================================================

require_once __DIR__ . '/cors.php';

// Suppress display errors — errors logged saja, tidak tampil ke browser
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// ── Baca env variable jika tersedia, fallback ke manual config ──
$host = getenv('DB_HOST') ?: 'localhost';
$user = getenv('DB_USER') ?: 'bus_web_user';
$pass = getenv('DB_PASS') ?: 'ddd07e8b630057ae737e35031f631a8f';
$db   = getenv('DB_NAME') ?: 'bus_pariwisata';

// ── Wrapper Classes & Functions untuk kompatibilitas MySQLi ke PostgreSQL (PDO) ──

class DBResult {
    private $stmt;
    private $rows = null;
    private $currentIndex = 0;

    public function __construct($stmt) {
        $this->stmt = $stmt;
        if ($stmt) {
            $this->rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
    }

    public function fetch_assoc() {
        if ($this->rows === null || $this->currentIndex >= count($this->rows)) {
            return null;
        }
        return $this->rows[$this->currentIndex++];
    }

    public function fetch_array() {
        if ($this->rows === null || $this->currentIndex >= count($this->rows)) {
            return null;
        }
        $row = $this->rows[$this->currentIndex++];
        $numRow = array_values($row);
        return array_merge($row, $numRow);
    }

    public function num_rows() {
        return $this->rows !== null ? count($this->rows) : 0;
    }
}

class DBStatement {
    private $conn;
    private $stmt;
    private $params = [];
    private $result = null;

    public function __construct($conn, $stmt) {
        $this->conn = $conn;
        $this->stmt = $stmt;
    }

    public function bind_param($types, &...$args) {
        $this->params = &$args;
        return true;
    }

    public function execute() {
        try {
            // Bind parameters dynamically for PDO positional parameters
            foreach ($this->params as $index => &$param) {
                // Determine parameter type (PDO::PARAM_INT for integer, PDO::PARAM_STR for rest)
                $type = is_int($param) ? PDO::PARAM_INT : (is_bool($param) ? PDO::PARAM_BOOL : (is_null($param) ? PDO::PARAM_NULL : PDO::PARAM_STR));
                $this->stmt->bindParam($index + 1, $param, $type);
            }
            $res = $this->stmt->execute();
            if ($res) {
                $this->result = new DBResult($this->stmt);
            }
            return $res;
        } catch (PDOException $e) {
            $this->conn->last_error = $e->getMessage();
            error_log("DB Execute Failed: " . $e->getMessage());
            return false;
        }
    }

    public function get_result() {
        return $this->result;
    }

    public function store_result() {
        return true;
    }

    public function num_rows() {
        return $this->result ? $this->result->num_rows() : 0;
    }

    public function close() {
        $this->stmt = null;
        return true;
    }

    public function error() {
        return $this->conn->last_error;
    }
}

// Wrapper Functions
function db_connect($host, $user, $pass, $db) {
    try {
        // Fallback or override connection details for PostgreSQL (port 5432)
        $conn = new PDO("pgsql:host=$host;port=5432;dbname=$db", $user, $pass);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $conn->last_error = '';
        return $conn;
    } catch (PDOException $e) {
        error_log("DB Connection failed: " . $e->getMessage());
        return false;
    }
}

function db_query($conn, $sql) {
    if (!$conn) return false;
    try {
        // PostgreSQL compatibility query translation
        
        // 1. SHOW TABLES LIKE '...' -> pg_tables check
        if (preg_match("/SHOW TABLES LIKE '([^']+)'/i", $sql, $matches)) {
            $tableName = $matches[1];
            $sql = "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public' AND tablename LIKE " . $conn->quote($tableName);
        }
        // 2. SHOW COLUMNS FROM ... -> columns schema check
        elseif (preg_match("/SHOW COLUMNS FROM (\w+)(?:\s+LIKE\s+'([^']+)')?/i", $sql, $matches)) {
            $tableName = $matches[1];
            $columnLike = isset($matches[2]) ? $matches[2] : null;
            $sql = "SELECT column_name AS \"Field\" FROM information_schema.columns WHERE table_schema = 'public' AND table_name = " . $conn->quote($tableName);
            if ($columnLike) {
                $sql .= " AND column_name LIKE " . $conn->quote($columnLike);
            }
        }

        $stmt = $conn->query($sql);
        return new DBResult($stmt);
    } catch (PDOException $e) {
        $conn->last_error = $e->getMessage();
        error_log("DB Query Failed: " . $e->getMessage());
        return false;
    }
}

function db_fetch_assoc($result) {
    if ($result instanceof DBResult) {
        return $result->fetch_assoc();
    }
    return null;
}

function db_fetch_array($result) {
    if ($result instanceof DBResult) {
        return $result->fetch_array();
    }
    return null;
}

// Emulate store_result as a no-op since PDO fetchAll is used immediately
function db_num_rows($result) {
    if ($result instanceof DBResult) {
        return $result->num_rows();
    }
    return 0;
}

function db_escape($conn, $str) {
    if (!$conn) return addslashes($str);
    $quoted = $conn->quote($str);
    if (substr($quoted, 0, 1) === "'" && substr($quoted, -1) === "'") {
        return substr($quoted, 1, -1);
    }
    return $quoted;
}

function db_prepare($conn, $sql) {
    if (!$conn) return false;
    try {
        // PostgreSQL compatibility query translation for prepared statements
        if (preg_match("/SHOW TABLES LIKE '([^']+)'/i", $sql, $matches)) {
            $tableName = $matches[1];
            $sql = "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public' AND tablename LIKE " . $conn->quote($tableName);
        }
        elseif (preg_match("/SHOW COLUMNS FROM (\w+)(?:\s+LIKE\s+'([^']+)')?/i", $sql, $matches)) {
            $tableName = $matches[1];
            $columnLike = isset($matches[2]) ? $matches[2] : null;
            $sql = "SELECT column_name AS \"Field\" FROM information_schema.columns WHERE table_schema = 'public' AND table_name = " . $conn->quote($tableName);
            if ($columnLike) {
                $sql .= " AND column_name LIKE " . $conn->quote($columnLike);
            }
        }

        $stmt = $conn->prepare($sql);
        return new DBStatement($conn, $stmt);
    } catch (PDOException $e) {
        $conn->last_error = $e->getMessage();
        error_log("DB Prepare Failed: " . $e->getMessage());
        return false;
    }
}

function db_stmt_bind_param($stmt, $types, &...$args) {
    if ($stmt instanceof DBStatement) {
        return $stmt->bind_param($types, ...$args);
    }
    return false;
}

function db_stmt_execute($stmt) {
    if ($stmt instanceof DBStatement) {
        return $stmt->execute();
    }
    return false;
}

function db_stmt_get_result($stmt) {
    if ($stmt instanceof DBStatement) {
        return $stmt->get_result();
    }
    return null;
}

// Emulate store_result as a no-op since PDO fetchAll is used immediately
function db_stmt_store_result($stmt) {
    if ($stmt instanceof DBStatement) {
        return $stmt->store_result();
    }
    return false;
}

function db_stmt_num_rows($stmt) {
    if ($stmt instanceof DBStatement) {
        return $stmt->num_rows();
    }
    return 0;
}

function db_stmt_close($stmt) {
    if ($stmt instanceof DBStatement) {
        return $stmt->close();
    }
    return false;
}

function db_insert_id($conn) {
    if (!$conn) return 0;
    return (int)$conn->lastInsertId();
}

function db_error($conn) {
    return isset($conn->last_error) ? $conn->last_error : '';
}

function db_close($conn) {
    $conn = null;
    return true;
}

function db_stmt_error($stmt) {
    if ($stmt instanceof DBStatement) {
        return $stmt->error();
    }
    return '';
}

function db_set_charset($conn, $charset) {
    if ($conn) {
        $conn->exec("SET client_encoding TO 'UTF8'");
    }
    return true;
}

// Inisialisasi Koneksi
$conn = @db_connect($host, $user, $pass, $db);

if (!$conn) {
    $conn = false;
} else {
    db_set_charset($conn, 'utf8mb4');
}
?>
