<?php
declare(strict_types=1);

require __DIR__ . '/../confs/liaison.php';

ini_set('session.use_strict_mode', '1');
session_name('stageplatform_sid');
session_start();

if (!isset($_SESSION['auth'])) {
  http_response_code(401);
  echo json_encode(['ok' => false, 'error' => 'UNAUTHORIZED'], JSON_UNESCAPED_UNICODE);
  exit;
}

echo json_encode(['ok' => true, 'user' => $_SESSION['auth']], JSON_UNESCAPED_UNICODE);