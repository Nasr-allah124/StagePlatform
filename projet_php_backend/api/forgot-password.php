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

$email = trim($input['email'] ?? '');

if (empty($email)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Email requis.']);
    exit;
}

try {
    // Créer la table si elle n'existe pas
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS password_resets (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            token VARCHAR(255) NOT NULL UNIQUE,
            expires_at TIMESTAMP NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    ");

    // Vérifier que l'email existe
    $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user) {
        // Message générique pour la sécurité
        http_response_code(200);
        echo json_encode(['ok' => true, 'message' => 'Si cet email existe, un lien a été envoyé.']);
        exit;
    }

    $userId = $user['id'];

    // Générer un token unique
    $token = bin2hex(random_bytes(32));
    $expiresAt = date('Y-m-d H:i:s', time() + 3600); // 1 heure

    // Supprimer les anciens tokens
    $stmt = $pdo->prepare('DELETE FROM password_resets WHERE user_id = ?');
    $stmt->execute([$userId]);

    // Insérer le nouveau token
    $stmt = $pdo->prepare('INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)');
    $stmt->execute([$userId, $token, $expiresAt]);

    // Créer le lien de réinitialisation
    $resetLink = "http://localhost:5173/reset-password?token={$token}";

    // TODO: Envoyer un email avec le lien au lieu de le retourner
    // mail($email, 'Réinitialisation de mot de passe', "Clique ici: {$resetLink}");

    http_response_code(200);
    echo json_encode([
        'ok' => true,
        'message' => 'Lien envoyé !',
        'reset_link' => $resetLink // À RETIRER en production
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Erreur serveur: ' . $e->getMessage()]);
}
