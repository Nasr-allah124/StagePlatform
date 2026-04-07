<?php
declare(strict_types=1);

require __DIR__ . '/../confs/liaison.php';

ini_set('session.use_strict_mode', '1');
session_name('stageplatform_sid');
session_start();

$_SESSION = [];
session_destroy();

setcookie(session_name(), '', [
  'expires' => time() - 3600,
  'path' => '/',
  'secure' => false,
  'httponly' => true,
  'samesite' => 'Lax',
]);

echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);