<?php
// api/_session.php
declare(strict_types=1);

// En dev localhost HTTP : cookie "Lax" OK
ini_set('session.use_strict_mode', '1');

session_name('stageplatform_sid');

session_set_cookie_params([
  'lifetime' => 0,          // session cookie par défaut
  'path' => '/',
  'domain' => '',           // laisser vide
  'secure' => false,        // true seulement si HTTPS
  'httponly' => true,
  'samesite' => 'Lax',
]);

session_start();

function session_regenerate_safe(): void {
  if (!isset($_SESSION['_regen'])) {
    session_regenerate_id(true);
    $_SESSION['_regen'] = time();
  }
}