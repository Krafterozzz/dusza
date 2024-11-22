<?php
session_start(); // Munkamenet indítása

// Munkamenet változók törlése
$_SESSION = [];

// Munkamenet megsemmisítése
session_destroy();

// Átirányítás az index.html oldalra
header("Location: ../index.html");
exit;
?>
