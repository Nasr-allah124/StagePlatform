<?php

require __DIR__ . '/../confs/liaison.php';

session_name('stageplatform_sid');
session_start();

header("Content-Type: application/json");

if (!isset($_SESSION['auth']['user_id'])) {
    http_response_code(401);
    echo json_encode(["ok" => false, "error" => "Unauthorized"]);
    exit;
}

$userId = (int) $_SESSION['auth']['user_id'];

try {
    // Récupérer le user connecté (doit être une company)
    $stmtUser = $pdo->prepare("SELECT id, role FROM users WHERE id = ?");
    $stmtUser->execute([$userId]);
    $user = $stmtUser->fetch();

    if (!$user || $user['role'] !== 'company') {
        http_response_code(403);
        echo json_encode(["ok" => false, "error" => "Only companies can delete offers"]);
        exit;
    }

    // Récupérer la company de l'utilisateur
    $stmtCompany = $pdo->prepare("SELECT id FROM companies WHERE user_id = ?");
    $stmtCompany->execute([$userId]);
    $company = $stmtCompany->fetch();

    if (!$company) {
        http_response_code(403);
        echo json_encode(["ok" => false, "error" => "Company not found"]);
        exit;
    }

    // Récupérer les données POST
    $data = json_decode(file_get_contents("php://input"), true);
    $offerId = $data["offer_id"] ?? null;

    if (!$offerId) {
        http_response_code(400);
        echo json_encode(["ok" => false, "error" => "Missing offer_id"]);
        exit;
    }

    // Vérifier que l'offre appartient à cette company
    $stmtCheck = $pdo->prepare("SELECT id FROM internships WHERE id = ? AND company_id = ?");
    $stmtCheck->execute([$offerId, $company['id']]);
    $offer = $stmtCheck->fetch();

    if (!$offer) {
        http_response_code(403);
        echo json_encode(["ok" => false, "error" => "Offer not found or not owned by your company"]);
        exit;
    }

    // Supprimer l'offre
    $stmtDelete = $pdo->prepare("DELETE FROM internships WHERE id = ?");
    $stmtDelete->execute([$offerId]);

    echo json_encode(["ok" => true, "message" => "Offer deleted successfully"]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(["ok" => false, "error" => $e->getMessage()]);
}
