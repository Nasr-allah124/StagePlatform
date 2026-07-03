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
    $stmt = $pdo->prepare("SELECT id FROM companies WHERE user_id = ?");
    $stmt->execute([$userId]);
    $company = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$company) {
        http_response_code(403);
        echo json_encode(["ok" => false, "error" => "Company not found"]);
        exit;
    }

    $companyId = $company['id'];

    $data = json_decode(file_get_contents("php://input"), true);

    $title = $data["title"] ?? "";
    $description = $data["description"] ?? "";
    $city = $data["city"] ?? "";
    $sector = $data["sector"] ?? "";
    $duration = $data["duration"] ?? "";
    $remote = $data["remote"] ?? "on-site";
    $salary = $data["salary"] ?? "";
    $experience = $data["experience"] ?? "beginner";
    $startDate = !empty($data["startDate"]) ? $data["startDate"] : null;  // Convertir en NULL si vide
    $requirements = $data["requirements"] ?? "";

    if (empty($title) || empty($description) || empty($city) || empty($duration)) {
        http_response_code(400);
        echo json_encode(["ok" => false, "error" => "Missing required fields"]);
        exit;
    }

    $st = $pdo->prepare("
INSERT INTO internships
(company_id, title, description, city, sector, duration, remote_policy, salary, experience_level, start_date, requirements)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
");

    $st->execute([
        $companyId,
        $title,
        $description,
        $city,
        $sector,
        $duration,
        $remote,
        $salary,
        $experience,
        $startDate,
        $requirements
    ]);

    // Récupérer l'ID de la nouvelle offre
    $internshipId = $pdo->lastInsertId();
    
    // Récupérer tous les étudiants
    $studentStmt = $pdo->prepare("SELECT id FROM users WHERE role = 'student'");
    $studentStmt->execute();
    $students = $studentStmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Créer une notification pour chaque étudiant
    $notificationMessage = "Une nouvelle offre a été publiée : " . $title;
    $notificationStmt = $pdo->prepare("
        INSERT INTO notifications (user_id, message, internship_id, is_read, created_at)
        VALUES (?, ?, ?, 0, CURRENT_TIMESTAMP)
    ");
    
    foreach ($students as $student) {
        $notificationStmt->execute([$student['id'], $notificationMessage, $internshipId]);
    }

    echo json_encode(["ok" => true, "message" => "Offer created successfully"]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["ok" => false, "error" => $e->getMessage()]);
}