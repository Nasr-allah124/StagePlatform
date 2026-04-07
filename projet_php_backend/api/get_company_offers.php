<?php

session_name('stageplatform_sid');
session_start();

require "../confs/liaison.php";

$companyId = $_SESSION["auth"]["id"];

$st = $pdo->prepare("
SELECT *
FROM internships
WHERE company_id=?
ORDER BY created_at DESC
");

$st->execute([$companyId]);

echo json_encode([
"ok"=>true,
"offers"=>$st->fetchAll(PDO::FETCH_ASSOC)
]);