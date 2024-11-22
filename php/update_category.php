<?php
header('Content-Type: application/json');

// Adatbázis kapcsolat adatai
include '../db_connection.php';

// Adatbázis kapcsolat létrehozása


// Kapcsolat ellenőrzése
if ($conn->connect_error) {
    echo json_encode([
        "success" => false,
        "message" => "Kapcsolódási hiba: " . $conn->connect_error
    ]);
    exit;
}

// UTF-8 karakterkódolás beállítása
$conn->set_charset("utf8mb4");

// POST adatok fogadása
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id']) || !isset($data['name']) || empty($data['name'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Hiányzó vagy érvénytelen adatok!'
    ]);
    exit;
}

// Adatok tisztítása
$id = $conn->real_escape_string($data['id']);
$name = $conn->real_escape_string($data['name']);

// SQL lekérdezés előkészítése
$sql = "UPDATE categories SET name = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("si", $name, $id);

// Lekérdezés végrehajtása és válasz küldése
if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode([
            "success" => true,
            "message" => "Kategória sikeresen frissítve!",
            "name" => $name,
            "id" => $id
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Nem található ilyen azonosítójú kategória"
        ]);
    }
} else {
    echo json_encode([
        "success" => false,
        "message" => "Hiba történt a frissítés során: " . $stmt->error
    ]);
}

$stmt->close();
$conn->close();
?>