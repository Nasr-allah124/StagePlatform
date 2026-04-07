<?php
require __DIR__ . '/../confs/liaison.php';

session_name('stageplatform_sid');
session_start();

if (!isset($_SESSION['auth']['user_id'])) {
    http_response_code(401);
    echo json_encode([
        "ok" => false,
        "error" => "Utilisateur non connecté"
    ]);
    exit;
}

$userId = (int) $_SESSION['auth']['user_id'];

try {
    // récupérer le user connecté
    $stmtUser = $pdo->prepare("SELECT id, role FROM users WHERE id = ?");
    $stmtUser->execute([$userId]);
    $user = $stmtUser->fetch();

    if (!$user) {
        http_response_code(404);
        echo json_encode([
            "ok" => false,
            "error" => "Utilisateur introuvable"
        ]);
        exit;
    }

    $role = $user['role'];

    // ETUDIANT => voir toutes les offres
    if ($role === 'student') {
        $stmt = $pdo->prepare("
            SELECT 
                i.id,
                i.company_id,
                i.title,
                i.description,
                i.city,
                i.level,
                i.duration,
                c.company_name
            FROM internships i
            INNER JOIN companies c ON c.id = i.company_id
            ORDER BY i.id DESC
        ");
        $stmt->execute();
        $offers = $stmt->fetchAll();

        echo json_encode([
            "ok" => true,
            "offers" => $offers
        ]);
        exit;
    }

    // COMPANY => voir seulement ses offres
    if ($role === 'company') {
        $stmtCompany = $pdo->prepare("SELECT id, company_name FROM companies WHERE user_id = ?");
        $stmtCompany->execute([$userId]);
        $company = $stmtCompany->fetch();

        if (!$company) {
            echo json_encode([
                "ok" => true,
                "offers" => []
            ]);
            exit;
        }

        $stmt = $pdo->prepare("
            SELECT 
                i.id,
                i.company_id,
                i.title,
                i.description,
                i.city,
                i.level,
                i.duration,
                c.company_name
            FROM internships i
            INNER JOIN companies c ON c.id = i.company_id
            WHERE i.company_id = ?
            ORDER BY i.id DESC
        ");
        $stmt->execute([$company['id']]);
        $offers = $stmt->fetchAll();

        echo json_encode([
            "ok" => true,
            "offers" => $offers
        ]);
        exit;
    }

    echo json_encode([
        "ok" => true,
        "offers" => []
    ]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "ok" => false,
        "error" => $e->getMessage()
    ]);
}