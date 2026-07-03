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

    $stmt = $pdo->prepare("SELECT m.*, u.email as sender_email FROM messages m JOIN users u ON m.sender_id = u.id WHERE m.receiver_id = ? ORDER BY m.created_at DESC");
    $stmt->execute([$user_id]);
    $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($messages);

    // Mark messages as read
    $stmt = $pdo->prepare("UPDATE messages SET is_read = 1 WHERE receiver_id = ?");
    $stmt->execute([$user_id]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>