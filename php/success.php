<?php
session_start();

// Ellenőrizzük, hogy sikeres volt-e a regisztráció
if (isset($_SESSION['registration_success']) && $_SESSION['registration_success'] === true) {
    // Ha sikeres volt, töröljük a session változót és átirányítunk a success.html-re
    unset($_SESSION['registration_success']);
    header("Location: ../html/success.html");
    exit();
} else {
    // Ha nem volt sikeres vagy direkt próbáltak a success.html-re menni, visszairányítunk a főoldalra
    header("Location: ../index.html");
    exit();
}
?>