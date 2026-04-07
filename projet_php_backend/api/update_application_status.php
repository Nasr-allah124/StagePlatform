<?php
require __DIR__ . '/../confs/liaison.php'; // On utilise ta liaison BDD
session_name('stageplatform_sid');
session_start();

header('Content-Type: application/json');

// On récupère les données envoyées par React
$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'] ?? null;
$newStatus = $data['status'] ?? null;

// Vérification de sécurité : Seule une entreprise devrait pouvoir faire ça
if (!isset($_SESSION['auth']['user_id'])) {
    http_response_code(401);
    echo json_encode(["ok" => false, "error" => "Non autorisé"]);
    exit;
}

if ($id && $newStatus) {
    try {
        $stmt = $pdo->prepare("UPDATE applications SET status = ? WHERE id = ?");
        $stmt->execute([$newStatus, $id]);
        
        echo json_encode(["ok" => true]);
    } catch (Exception $e) {
        echo json_encode(["ok" => false, "error" => $e->getMessage()]);
    }
}