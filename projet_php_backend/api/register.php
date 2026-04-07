<?php
declare(strict_types=1);

require_once __DIR__ . "/../confs/liaison.php";

header("Content-Type: application/json; charset=utf-8");

// CORS (dev)
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(200);
  exit;
}

/* =========================
   SESSION (IMPORTANT)
========================= */
ini_set('session.use_strict_mode', '1');
session_name('stageplatform_sid');
session_start();

/* =========================
   INPUT
========================= */
$data = json_decode(file_get_contents("php://input"), true);

function bad($msg) {
  http_response_code(400);
  echo json_encode(["ok" => false, "message" => $msg], JSON_UNESCAPED_UNICODE);
  exit;
}

$role = $data["role"] ?? "";
$email = trim($data["email"] ?? "");
$password = $data["password"] ?? "";
$phone = trim($data["phone"] ?? "");

if (!in_array($role, ["student", "company"])) bad("Rôle invalide.");
if (!$email) bad("Email requis.");
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) bad("Email invalide.");
if (!$password || strlen($password) < 6) bad("Mot de passe min 6 caractères.");

$profile = $data["profile"] ?? null;
if (!$profile || !is_array($profile)) bad("Profil requis.");

try {

  /* =========================
     CHECK EMAIL
  ========================= */
  $st = $pdo->prepare("SELECT id FROM users WHERE email = ?");
  $st->execute([$email]);

  if ($st->fetch()) {
    bad("Email déjà utilisé.");
  }

  $pdo->beginTransaction();

  /* =========================
     CREATE USER
  ========================= */
  $hash = password_hash($password, PASSWORD_DEFAULT);

  $st = $pdo->prepare("
    INSERT INTO users (role, email, password_hash, phone)
    VALUES (?,?,?,?)
  ");

  $st->execute([
    $role,
    $email,
    $hash,
    $phone ?: null
  ]);

  $userId = (int)$pdo->lastInsertId();

  /* =========================
     PROFILE
  ========================= */

  if ($role === "student") {

    $full_name = trim($profile["full_name"] ?? "");
    $school = trim($profile["school"] ?? "");
    $level = trim($profile["level"] ?? "");

    if (!$full_name) bad("Nom complet requis.");
    if (!$school) bad("École requise.");
    if (!$level) bad("Niveau requis.");

    $st = $pdo->prepare("
      INSERT INTO students (user_id, full_name, school, level)
      VALUES (?,?,?,?)
    ");

    $st->execute([
      $userId,
      $full_name,
      $school,
      $level
    ]);

    $profileData = [
      "full_name" => $full_name,
      "school" => $school,
      "level" => $level
    ];

  } else {

    $company_name = trim($profile["company_name"] ?? "");
    $sector = trim($profile["sector"] ?? "");
    $city = trim($profile["city"] ?? "");
    $website = trim($profile["website"] ?? "");

    if (!$company_name) bad("Nom entreprise requis.");
    if (!$sector) bad("Secteur requis.");
    if (!$city) bad("Ville requise.");

    $st = $pdo->prepare("
      INSERT INTO companies (user_id, company_name, sector, city, website)
      VALUES (?,?,?,?,?)
    ");

    $st->execute([
      $userId,
      $company_name,
      $sector,
      $city,
      $website ?: null
    ]);

    $profileData = [
      "company_name" => $company_name,
      "sector" => $sector,
      "city" => $city,
      "website" => $website ?: null
    ];
  }

  $pdo->commit();

  /* =========================
     AUTO LOGIN (IMPORTANT)
  ========================= */

  $_SESSION["auth"] = [
    "id" => $userId,
    "role" => $role,
    "email" => $email,
    "profile" => $profileData
  ];



  echo json_encode([
    "ok" => true,
    "message" => "Compte créé",
    "user" => $_SESSION["auth"]
  ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {

  if ($pdo->inTransaction()) {
    $pdo->rollBack();
  }

  http_response_code(500);

  echo json_encode([
    "ok" => false,
    "message" => "Erreur serveur",
    "error" => $e->getMessage()
  ], JSON_UNESCAPED_UNICODE);
}

