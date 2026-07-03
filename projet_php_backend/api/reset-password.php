<?php
declare(strict_types=1);

require __DIR__ . '/../confs/liaison.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'METHOD_NOT_ALLOWED']);
    exit;
}

$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);

if (!$input || json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'INVALID_JSON']);
    exit;
}

$token = trim($input['token'] ?? '');
$newPassword = $input['new_password'] ?? '';
$confirmPassword = $input['confirm_password'] ?? '';

if (empty($token)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Token invalide.']);
    exit;
}

if (strlen($newPassword) < 6) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Le mot de passe doit contenir au moins 6 caractères.']);
    exit;
}

if ($newPassword !== $confirmPassword) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Les mots de passe ne correspondent pas.']);
    exit;
}

try {
    // Vérifier le token
    $stmt = $pdo->prepare('
        SELECT user_id FROM password_resets 
        WHERE token = ? AND expires_at > NOW()
    ');
    $stmt->execute([$token]);
    $reset = $stmt->fetch();

    if (!$reset) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Lien expiré ou invalide.']);
        exit;
    }

    $userId = $reset['user_id'];
    $passwordHash = password_hash($newPassword, PASSWORD_BCRYPT);

    // Mettre à jour le mot de passe
    $stmt = $pdo->prepare('UPDATE users SET password_hash = ? WHERE id = ?');
    $stmt->execute([$passwordHash, $userId]);

    // Supprimer le token utilisé
    $stmt = $pdo->prepare('DELETE FROM password_resets WHERE token = ?');
    $stmt->execute([$token]);

    http_response_code(200);
    echo json_encode(['ok' => true, 'message' => 'Mot de passe réinitialisé avec succès !']);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Erreur serveur: ' . $e->getMessage()]);
}
