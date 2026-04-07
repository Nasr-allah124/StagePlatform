<?php

require "../confs/liaison.php";

header("Content-Type: application/json");

$st = $pdo->query("
SELECT *
FROM internships
ORDER BY created_at DESC
");

echo json_encode([
"ok"=>true,
"offers"=>$st->fetchAll(PDO::FETCH_ASSOC)
]);