<?php
declare(strict_types=1);
header("Access-Control-Allow-Origin: http://localhost:5173"); // Remplace par l'URL de ton frontend
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
require __DIR__ . '/../confs/liaison.php';

ini_set('session.use_strict_mode', '1');
session_name('stageplatform_sid');
session_start();

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
  http_response_code(405);
  echo json_encode([
    'ok' => false,
    'error' => 'METHOD_NOT_ALLOWED'
  ], JSON_UNESCAPED_UNICODE);
  exit;
}

if (!isset($_SESSION['auth']['user_id'])) {
  http_response_code(401);
  echo json_encode([
    'ok' => false,
    'error' => 'UNAUTHORIZED'
  ], JSON_UNESCAPED_UNICODE);
  exit;
}

$userId = (int) $_SESSION['auth']['user_id'];

try {
  $stmt = $pdo->prepare("
    SELECT id, role, email, phone, created_at
    FROM users
    WHERE id = ?
    LIMIT 1
  ");
  $stmt->execute([$userId]);
  $user = $stmt->fetch();

  if (!$user) {
    http_response_code(404);
    echo json_encode([
      'ok' => false,
      'error' => 'USER_NOT_FOUND'
    ], JSON_UNESCAPED_UNICODE);
    exit;
  }

  $profile = null;

  if ($user['role'] === 'student') {
    $stmtStudent = $pdo->prepare("
      SELECT id, user_id, full_name, school, level, created_at
      FROM students
      WHERE user_id = ?
      LIMIT 1
    ");
    $stmtStudent->execute([$userId]);
    $profile = $stmtStudent->fetch();
  } elseif ($user['role'] === 'company') {
    $stmtCompany = $pdo->prepare("
      SELECT id, user_id, company_name, sector, city, website
      FROM companies
      WHERE user_id = ?
      LIMIT 1
    ");
    $stmtCompany->execute([$userId]);
    $profile = $stmtCompany->fetch();
  }

  echo json_encode([
    'ok' => true,
    'user' => [
      'id' => (int)$user['id'],
      'role' => $user['role'],
      'email' => $user['email'],
      'phone' => $user['phone'],
      'created_at' => $user['created_at'],
      'profile' => $profile
    ]
  ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode([
    'ok' => false,
    'error' => 'PROFILE_FETCH_FAILED'
  ], JSON_UNESCAPED_UNICODE);
}