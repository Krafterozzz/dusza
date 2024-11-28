<?php

// Adatbázis kapcsolódási adatok
$servername = "localhost:3306";  // DNS név, portot külön adjuk megsz
$db_username = "root";
$db_password = "";
$dbname = "duszadb";

// Kapcsolódás az adatbázishoz
$conn = new mysqli($servername, $db_username, $db_password, $dbname); 

// Kapcsolódás ellenőrzése
if ($conn->connect_error) {
    die("Kapcsolódási hiba: " . $conn->connect_error);
}

// Beállítjuk a karakterkódolást, hogy UTF-8-at használjunk az adatbázissal való kommunikációban
$conn->set_charset("utf8mb4");

?>
