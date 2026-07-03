<?php

require "../confs/liaison.php";

session_name('stageplatform_sid');
session_start();

header("Content-Type: application/json");

if (!isset($_SESSION['auth']['user_id'])) {
    http_response_code(401);
    echo json_encode(["ok" => false, "error" => "Unauthorized"]);
    exit;
}

$userId = intval($_SESSION['auth']['user_id']);

try {
    // Vérifier que c'est une entreprise
    $stmt = $pdo->prepare("SELECT id FROM companies WHERE user_id = ?");
    $stmt->execute([$userId]);
    $company = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$company) {
        http_response_code(403);
        echo json_encode(["ok" => false, "error" => "Not a company"]);
        exit;
    }

    $companyId = $company['id'];

    // 1. Récupérer toutes les offres de l'entreprise avec le nombre de candidatures
    $offersStmt = $pdo->prepare("
        SELECT 
            i.id,
            i.title,
            COUNT(DISTINCT a.id) as total_applications,
            SUM(CASE WHEN a.status = 'accepted' THEN 1 ELSE 0 END) as accepted,
            SUM(CASE WHEN a.status = 'rejected' THEN 1 ELSE 0 END) as rejected,
            SUM(CASE WHEN a.status = 'pending' THEN 1 ELSE 0 END) as pending
        FROM internships i
        LEFT JOIN applications a ON i.id = a.internship_id
        WHERE i.company_id = ?
        GROUP BY i.id, i.title
        ORDER BY total_applications DESC
    ");
    $offersStmt->execute([$companyId]);
    $offers = $offersStmt->fetchAll(PDO::FETCH_ASSOC);

    // 2. Calculer les statistiques globales
    $totalApplications = 0;
    $totalAccepted = 0;
    $totalRejected = 0;
    $totalPending = 0;
    $mostPopularOffer = null;
    $maxApplications = 0;

    foreach ($offers as $offer) {
        $totalApplications += intval($offer['total_applications']);
        $totalAccepted += intval($offer['accepted']);
        $totalRejected += intval($offer['rejected']);
        $totalPending += intval($offer['pending']);
        
        if (intval($offer['total_applications']) > $maxApplications) {
            $maxApplications = intval($offer['total_applications']);
            $mostPopularOffer = $offer;
        }
    }

    $analytics = [
        "ok" => true,
        "total_applications" => $totalApplications,
        "total_accepted" => $totalAccepted,
        "total_rejected" => $totalRejected,
        "total_pending" => $totalPending,
        "most_popular_offer" => $mostPopularOffer,
        "offers_breakdown" => $offers
    ];

    echo json_encode($analytics);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["ok" => false, "error" => $e->getMessage()]);
}
?>
