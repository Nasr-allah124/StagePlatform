<?php
declare(strict_types=1);

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require __DIR__ . '/../confs/liaison.php';

ini_set('session.use_strict_mode', '1');
session_name('stageplatform_sid');
session_start();

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'METHOD_NOT_ALLOWED']);
    exit;
}

if (!isset($_SESSION['auth']['user_id'])) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'error' => 'UNAUTHORIZED']);
    exit;
}

$userId = (int) $_SESSION['auth']['user_id'];

$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);

if (!$input || json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'INVALID_JSON']);
    exit;
}

$currentPassword = $input['current_password'] ?? '';
$newPassword = $input['new_password'] ?? '';
$confirmPassword = $input['confirm_password'] ?? '';

if (strlen($newPassword) < 8) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'PASSWORD_TOO_SHORT']);
    exit;
}

if ($newPassword !== $confirmPassword) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'PASSWORDS_DONT_MATCH']);
    exit;
}

try {
    // ⚠️ CORRECTION ICI : password_hash au lieu de password
    $stmt = $pdo->prepare("SELECT password_hash FROM users WHERE id = ? LIMIT 1");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();

    if (!$user) {
        http_response_code(404);
        echo json_encode(['ok' => false, 'error' => 'USER_NOT_FOUND']);
        exit;
    }

    // Vérifier le mot de passe actuel
    if (!password_verify($currentPassword, $user['password_hash'])) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'INVALID_CURRENT_PASSWORD']);
        exit;
    }

    // Hasher et sauvegarder le nouveau
    $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
    
    // ⚠️ CORRECTION ICI : password_hash au lieu de password
    $stmt = $pdo->prepare("UPDATE users SET password_hash = ? WHERE id = ?");
    $stmt->execute([$hashedPassword, $userId]);

    echo json_encode([
        'ok' => true,
        'message' => 'Mot de passe modifié avec succès'
    ]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'error' => 'PASSWORD_CHANGE_FAILED',
        'debug' => $e->getMessage()
    ]);
}