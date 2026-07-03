<?php
session_name('stageplatform_sid');
session_start();
require __DIR__ . '/../confs/liaison.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (!isset($_SESSION['auth']['user_id'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }

    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data || !isset($data['application_id']) || !isset($data['receiver_id']) || !isset($data['message'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields']);
        exit;
    }
    
    $application_id = intval($data['application_id']);
    $receiver_id = intval($data['receiver_id']);
    $message = $data['message'];
    $sender_id = intval($_SESSION['auth']['user_id']);

    if (empty($message)) {
        http_response_code(400);
        echo json_encode(['error' => 'Message cannot be empty']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO messages (application_id, sender_id, receiver_id, message) VALUES (?, ?, ?, ?)");
        
        if (!$stmt) {
            throw new Exception("Prepare failed");
        }
        
        $stmt->execute([$application_id, $sender_id, $receiver_id, $message]);
        echo json_encode(['success' => true]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}
?>