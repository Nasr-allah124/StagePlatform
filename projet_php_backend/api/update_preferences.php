<?php
require __DIR__ . '/../confs/liaison.php'; 
session_name('stageplatform_sid');
session_start();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173'); 
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if (!isset($_SESSION['auth']['user_id'])) {
    echo json_encode(["ok" => false, "error" => "Non connecté"]);
    exit;
}

$userId = $_SESSION['auth']['user_id'];
$data = json_decode(file_get_contents("php://input"), true);

try {
  
    $sql = "INSERT INTO user_preferences 
            (user_id, language, theme, preferred_city, preferred_sector, preferred_level, internship_type, remote_allowed) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            language=VALUES(language), 
            theme=VALUES(theme), 
            preferred_city=VALUES(preferred_city), 
            preferred_sector=VALUES(preferred_sector), 
            preferred_level=VALUES(preferred_level), 
            internship_type=VALUES(internship_type), 
            remote_allowed=VALUES(remote_allowed)";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $userId,
        $data['language'] ?? 'fr',
        $data['theme'] ?? 'light',
        $data['preferred_city'] ?? null,
        $data['preferred_sector'] ?? null,
        $data['preferred_level'] ?? null,
        $data['internship_type'] ?? null,
        $data['remote_allowed'] ? 1 : 0
    ]);

    echo json_encode(["ok" => true, "message" => "Préférences sauvegardées"]);
} catch (Exception $e) {
    echo json_encode(["ok" => false, "error" => $e->getMessage()]);
}