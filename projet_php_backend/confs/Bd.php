<?php
require_once __DIR__ . "/liaison.php";

try {
  $st = $pdo->query("SELECT DATABASE() AS db");
  $row = $st->fetch();

  echo json_encode(["ok" => true, "db" => $row["db"]]);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(["ok" => false, "error" => $e->getMessage()]);
}
