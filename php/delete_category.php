<?php
header('Content-Type: application/json');

include '../db_connection.php';

// JSON adat beolvasása
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id'])) {
    echo json_encode([
        "success" => false,
        "message" => "Hiányzó kategória azonosító!"
    ]);
    exit;
}

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

// ID tisztítása
$id = (int)$data['id'];

// Kategória törlése
$sql = "DELETE FROM categories WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Kategória sikeresen törölve!"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Hiba történt a kategória törlése során: " . $stmt->error
    ]);
}

$stmt->close();
$conn->close();