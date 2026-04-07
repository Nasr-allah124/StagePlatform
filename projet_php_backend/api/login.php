<?php
declare(strict_types=1);

require __DIR__ . '/../confs/liaison.php'; // ton fichier (CORS + JSON + PDO)

// Helpers simples (comme tu n'as pas bootstrap)
function json_response(array $data, int $status = 200): void {
  http_response_code($status);
  echo json_encode($data, JSON_UNESCAPED_UNICODE);
  exit;
}

function read_json_body(): array {
  $raw = file_get_contents('php://input');
  $data = json_decode($raw ?: '', true);
  if (!is_array($data)) {
    json_response(['ok' => false, 'error' => 'INVALID_JSON'], 400);
  }
  return $data;
}

// Session (sans fichier séparé)
ini_set('session.use_strict_mode', '1');
session_name('stageplatform_sid');
session_set_cookie_params([
  'lifetime' => 0,
  'path' => '/',
  'domain' => '',
  'secure' => false,   // mets true uniquement en HTTPS
  'httponly' => true,
  'samesite' => 'Lax',
]);
session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  json_response(['ok' => false, 'error' => 'METHOD_NOT_ALLOWED'], 405);
}

$body = read_json_body();

$email = isset($body['email']) ? trim((string)$body['email']) : '';
$password = isset($body['password']) ? (string)$body['password'] : '';
$remember = (bool)($body['remember'] ?? false);

// Validation
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
  json_response(['ok' => false, 'error' => 'INVALID_EMAIL'], 422);
}
if ($password === '' || strlen($password) < 6) {
  json_response(['ok' => false, 'error' => 'INVALID_PASSWORD'], 422);
}

try {
  // 1) récupérer user par email
  $stmt = $pdo->prepare('
    SELECT id, role, email, password_hash, phone
    FROM users
    WHERE email = ?
    LIMIT 1
  ');
  $stmt->execute([$email]);
  $user = $stmt->fetch();

  // même message si email inexistant ou mdp incorrect (sécurité)
  if (!$user || !is_string($user['password_hash']) || $user['password_hash'] === '') {
    json_response(['ok' => false, 'error' => 'INVALID_CREDENTIALS'], 401);
  }

  // 2) vérifier mot de passe
  if (!password_verify($password, $user['password_hash'])) {
    json_response(['ok' => false, 'error' => 'INVALID_CREDENTIALS'], 401);
  }

  // 3) (optionnel) rehash si nécessaire
  if (password_needs_rehash($user['password_hash'], PASSWORD_DEFAULT)) {
    $newHash = password_hash($password, PASSWORD_DEFAULT);
    if ($newHash !== false) {
      $u = $pdo->prepare('UPDATE users SET password_hash = ? WHERE id = ?');
      $u->execute([$newHash, (int)$user['id']]);
    }
  }

  // 4) charger profile selon role (optionnel mais pratique)
  $profile = null;
  if ($user['role'] === 'student') {
    $p = $pdo->prepare('SELECT full_name, school, level FROM students WHERE user_id = ? LIMIT 1');
    $p->execute([(int)$user['id']]);
    $profile = $p->fetch() ?: null;
  } elseif ($user['role'] === 'company') {
    $p = $pdo->prepare('SELECT company_name, sector, city, website FROM companies WHERE user_id = ? LIMIT 1');
    $p->execute([(int)$user['id']]);
    $profile = $p->fetch() ?: null;
  }

  // 5) remember me (version simple = cookie session long)
  if ($remember) {
    setcookie(session_name(), session_id(), [
      'expires' => time() + 60 * 60 * 24 * 30, // 30 jours
      'path' => '/',
      'secure' => false,
      'httponly' => true,
      'samesite' => 'Lax',
    ]);
  }

  // 6) sécuriser session
  session_regenerate_id(true);

  // 7) stocker auth
  $_SESSION['auth'] = [
    'user_id' => (int)$user['id'],
    'role' => $user['role'],
    'email' => $user['email'],
    'logged_in_at' => time(),
  ];

  // 8) réponse
  json_response([
    'ok' => true,
    'user' => [
      'id' => (int)$user['id'],
      'role' => $user['role'],
      'email' => $user['email'],
      'phone' => $user['phone'],
      'profile' => $profile,
    ]
  ]);

} catch (Throwable $e) {
  json_response(['ok' => false, 'error' => 'LOGIN_FAILED'], 500);
}