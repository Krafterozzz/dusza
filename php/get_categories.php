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

// Kategóriák lekérése
$sql = "SELECT id, name FROM categories ORDER BY name";
$result = $conn->query($sql);

if ($result) {
    $categories = [];
    while ($row = $result->fetch_assoc()) {
        $categories[] = [
            'id' => $row['id'],
            'name' => $row['name']
        ];
    }
    
    echo json_encode([
        "success" => true,
        "categories" => $categories
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Hiba történt a kategóriák lekérése során: " . $conn->error
    ]);
}

$conn->close();
?>