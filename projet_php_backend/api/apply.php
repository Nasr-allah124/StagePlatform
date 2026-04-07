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

$name = trim($_POST['name'] ?? "");
$email = trim($_POST['email'] ?? "");
$message = trim($_POST['message'] ?? "");
$internshipId = (int) ($_POST['internship_id'] ?? 0);
$cv = $_FILES['cv'] ?? null;

if (!$internshipId || !$name || !$email) {
    http_response_code(400);
    echo json_encode([
        "ok" => false,
        "error" => "Champs obligatoires manquants"
    ]);
    exit;
}

try {
    // vérifier user
    $stmtUser = $pdo->prepare("SELECT id, role FROM users WHERE id = ?");
    $stmtUser->execute([$userId]);
    $user = $stmtUser->fetch();

    if (!$user || $user['role'] !== 'student') {
        http_response_code(403);
        echo json_encode([
            "ok" => false,
            "error" => "Seuls les étudiants peuvent postuler"
        ]);
        exit;
    }

    // vérifier que l'offre existe
    $stmtOffer = $pdo->prepare("
        SELECT i.id, i.company_id, c.company_name
        FROM internships i
        INNER JOIN companies c ON c.id = i.company_id
        WHERE i.id = ?
    ");
    $stmtOffer->execute([$internshipId]);
    $offer = $stmtOffer->fetch();

    if (!$offer) {
        http_response_code(404);
        echo json_encode([
            "ok" => false,
            "error" => "Offre introuvable"
        ]);
        exit;
    }

    // éviter double candidature
    $stmtCheck = $pdo->prepare("
        SELECT id FROM applications
        WHERE student_id = ? AND internship_id = ?
    ");
    $stmtCheck->execute([$userId, $internshipId]);

    if ($stmtCheck->fetch()) {
        echo json_encode([
            "ok" => false,
            "error" => "Vous avez déjà postulé à cette offre"
        ]);
        exit;
    }

    // upload cv
    $cvPath = null;

    if ($cv && !empty($cv['tmp_name'])) {
        $uploadDir = __DIR__ . '/../uploads/';

        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $safeName = time() . "_" . preg_replace('/[^A-Za-z0-9._-]/', '_', $cv['name']);
        $target = $uploadDir . $safeName;

        if (move_uploaded_file($cv['tmp_name'], $target)) {
            $cvPath = "uploads/" . $safeName;
        }
    }

    // insertion candidature
    $stmt = $pdo->prepare("
        INSERT INTO applications
        (internship_id, student_id, student_name, student_email, message, cv_path)
        VALUES (?, ?, ?, ?, ?, ?)
    ");

    $stmt->execute([
        $internshipId,
        $userId,
        $name,
        $email,
        $message,
        $cvPath
    ]);

    echo json_encode([
        "ok" => true,
        "message" => "Candidature envoyée avec succès",
        "company_name" => $offer['company_name']
    ]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "ok" => false,
        "error" => $e->getMessage()
    ]);
}