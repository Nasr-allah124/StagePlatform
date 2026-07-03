<?php
session_name('stageplatform_sid');
session_start();
require __DIR__ . '/../confs/liaison.php';

header('Content-Type: application/json');

if (!isset($_SESSION['auth']['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

try {
    $user_id = intval($_SESSION['auth']['user_id']);

    // Récupérer les notifications non lues de l'utilisateur
    $stmt = $pdo->prepare("
        SELECT n.*, i.title as offer_title 
        FROM notifications n 
        LEFT JOIN internships i ON n.internship_id = i.id 
        WHERE n.user_id = ? 
        ORDER BY n.created_at DESC
    ");
    $stmt->execute([$user_id]);
    $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($notifications);

    // Marquer les notifications comme lues
    $stmt = $pdo->prepare("UPDATE notifications SET is_read = 1 WHERE user_id = ?");
    $stmt->execute([$user_id]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
