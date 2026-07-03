<?php

require __DIR__ . '/../confs/liaison.php';

session_name('stageplatform_sid');
session_start();

header('Content-Type: application/json');

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
    // récupérer le rôle du user connecté
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

    // ---------------- ETUDIANT ----------------
    if ($user['role'] === 'student') {
        $stmt = $pdo->prepare("
            SELECT 
                applications.id,
                applications.status,
                applications.created_at,
                applications.student_name,
                applications.student_email,
                applications.message,
                applications.cv_path,
                internships.title,
                internships.city,
                companies.company_name,
                companies.user_id as company_user_id
            FROM applications
            JOIN internships
                ON applications.internship_id = internships.id
            JOIN companies
                ON internships.company_id = companies.id
            WHERE applications.student_id = ?
            ORDER BY applications.created_at DESC
        ");

        $stmt->execute([$userId]);
        $applications = $stmt->fetchAll();

        echo json_encode([
            "ok" => true,
            "role" => "student",
            "applications" => $applications
        ]);
        exit;
    }

    // ---------------- COMPANY ----------------
    if ($user['role'] === 'company') {
        // récupérer la company liée à ce user
        $stmtCompany = $pdo->prepare("SELECT id, company_name FROM companies WHERE user_id = ?");
        $stmtCompany->execute([$userId]);
        $company = $stmtCompany->fetch();

        if (!$company) {
            echo json_encode([
                "ok" => true,
                "role" => "company",
                "applications" => []
            ]);
            exit;
        }

        $stmt = $pdo->prepare("
            SELECT 
                applications.id,
                applications.status,
                applications.created_at,
                applications.student_name,
                applications.student_email,
                applications.message,
                applications.cv_path,
                internships.id AS internship_id,
                internships.title,
                internships.city,
                companies.company_name,
                applications.student_id
            FROM applications
            JOIN internships
                ON applications.internship_id = internships.id
            JOIN companies
                ON internships.company_id = companies.id
            WHERE internships.company_id = ?
            ORDER BY applications.created_at DESC
        ");

        $stmt->execute([$company['id']]);
        $applications = $stmt->fetchAll();

        echo json_encode([
            "ok" => true,
            "role" => "company",
            "applications" => $applications
        ]);
        exit;
    }

    echo json_encode([
        "ok" => true,
        "applications" => []
    ]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "ok" => false,
        "error" => $e->getMessage()
    ]);
}