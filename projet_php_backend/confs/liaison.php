<?php
$requestOrigin = isset($_SERVER["HTTP_ORIGIN"]) ? $_SERVER["HTTP_ORIGIN"] : "";
$isLocalOrigin = preg_match('/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/', $requestOrigin) === 1;
if ($isLocalOrigin) {
  header("Access-Control-Allow-Origin: " . $requestOrigin);
  header("Vary: Origin");
}

header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(200);
  exit;
}

$host = "db";             // "db" est le nom du service dans ton docker-compose
$dbName = "site_paltforme";
$user = "root";
$pass = "root";           // Le mot de passe que tu as mis dans le docker-compose

try {
  $pdo = new PDO(
    "mysql:host={$host};dbname={$dbName};charset=utf8mb4",
    $user,
    $pass,
    [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
      PDO::ATTR_EMULATE_PREPARES => false,
    ]
  );
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode([
    "ok" => false,
    "error" => "Connexion BDD impossible",
    "details" => $e->getMessage(),
  ]);
  exit;
}
?>
