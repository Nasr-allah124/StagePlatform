<?php
declare(strict_types=1);

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

// Gérer les requêtes OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require __DIR__ . '/../confs/liaison.php';

ini_set('session.use_strict_mode', '1');
session_name('stageplatform_sid');
session_start();

header('Content-Type: application/json; charset=utf-8');

// Vérifier l'authentification
if (!isset($_SESSION['auth']['user_id'])) {
    http_response_code(401);
    echo json_encode([
        'ok' => false,
        'error' => 'UNAUTHORIZED'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$userId = (int) $_SESSION['auth']['user_id'];

// Récupérer les données JSON envoyées
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode([
        'ok' => false,
        'error' => 'INVALID_JSON'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    // Récupérer le rôle de l'utilisateur
    $stmt = $pdo->prepare("SELECT role FROM users WHERE id = ? LIMIT 1");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();

    if (!$user) {
        http_response_code(404);
        echo json_encode([
            'ok' => false,
            'error' => 'USER_NOT_FOUND'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $role = $user['role'];
    $pdo->beginTransaction();

    // Mettre à jour les champs communs dans la table users
    $userUpdates = [];
    $userParams = [];

    if (isset($input['phone'])) {
        $userUpdates[] = "phone = ?";
        $userParams[] = $input['phone'];
    }

    if (!empty($userUpdates)) {
        $userParams[] = $userId;
        $sql = "UPDATE users SET " . implode(', ', $userUpdates) . " WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($userParams);
    }

    // Mettre à jour selon le rôle
    if ($role === 'student') {
        $studentUpdates = [];
        $studentParams = [];

        if (isset($input['full_name'])) {
            $studentUpdates[] = "full_name = ?";
            $studentParams[] = $input['full_name'];
        }
        if (isset($input['school'])) {
            $studentUpdates[] = "school = ?";
            $studentParams[] = $input['school'];
        }
        if (isset($input['level'])) {
            $studentUpdates[] = "level = ?";
            $studentParams[] = $input['level'];
        }

        if (!empty($studentUpdates)) {
            // Vérifier si le profil étudiant existe
            $stmt = $pdo->prepare("SELECT id FROM students WHERE user_id = ? LIMIT 1");
            $stmt->execute([$userId]);
            $exists = $stmt->fetch();

            if ($exists) {
                // Mettre à jour
                $studentParams[] = $userId;
                $sql = "UPDATE students SET " . implode(', ', $studentUpdates) . " WHERE user_id = ?";
            } else {
                // Créer le profil s'il n'existe pas
                $sql = "INSERT INTO students (user_id, full_name, school, level) VALUES (?, ?, ?, ?)";
                $studentParams = [
                    $userId,
                    $input['full_name'] ?? '',
                    $input['school'] ?? '',
                    $input['level'] ?? ''
                ];
            }
            $stmt = $pdo->prepare($sql);
            $stmt->execute($studentParams);
        }

    } elseif ($role === 'company') {
        $companyUpdates = [];
        $companyParams = [];

        if (isset($input['company_name'])) {
            $companyUpdates[] = "company_name = ?";
            $companyParams[] = $input['company_name'];
        }
        if (isset($input['sector'])) {
            $companyUpdates[] = "sector = ?";
            $companyParams[] = $input['sector'];
        }
        if (isset($input['city'])) {
            $companyUpdates[] = "city = ?";
            $companyParams[] = $input['city'];
        }
        if (isset($input['website'])) {
            $companyUpdates[] = "website = ?";
            $companyParams[] = $input['website'];
        }

        if (!empty($companyUpdates)) {
            // Vérifier si le profil entreprise existe
            $stmt = $pdo->prepare("SELECT id FROM companies WHERE user_id = ? LIMIT 1");
            $stmt->execute([$userId]);
            $exists = $stmt->fetch();

            if ($exists) {
                // Mettre à jour
                $companyParams[] = $userId;
                $sql = "UPDATE companies SET " . implode(', ', $companyUpdates) . " WHERE user_id = ?";
            } else {
                // Créer le profil s'il n'existe pas
                $sql = "INSERT INTO companies (user_id, company_name, sector, city, website) VALUES (?, ?, ?, ?, ?)";
                $companyParams = [
                    $userId,
                    $input['company_name'] ?? '',
                    $input['sector'] ?? '',
                    $input['city'] ?? '',
                    $input['website'] ?? ''
                ];
            }
            $stmt = $pdo->prepare($sql);
            $stmt->execute($companyParams);
        }
    }

    $pdo->commit();

    echo json_encode([
        'ok' => true,
        'message' => 'Profil mis à jour avec succès'
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'error' => 'UPDATE_FAILED',
        'details' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}