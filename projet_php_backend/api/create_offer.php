<?php

require "../confs/liaison.php";

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$title = $data["title"] ?? "";
$description = $data["description"] ?? "";
$city = $data["city"] ?? "";
$level = $data["level"] ?? "";
$duration = $data["duration"] ?? "";

/* ici j’utilise company_id = 1 juste pour tester */
$companyId = 1;

$st = $pdo->prepare("
INSERT INTO internships
(company_id,title,description,city,level,duration)
VALUES (?,?,?,?,?,?)
");

$st->execute([
$companyId,
$title,
$description,
$city,
$level,
$duration
]);

echo json_encode(["ok"=>true]);