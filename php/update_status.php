<?php
header('Content-Type: application/json');

// Adatbázis kapcsolat adatai
include '../db_connection.php';

// Adatbázis kapcsolat létrehozása


// Kapcsolat ellenőrzése
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Kapcsolódási hiba: " . $conn->connect_error]);
    exit;
}

// UTF-8 karakterkódolás beállítása
$conn->set_charset("utf8mb4");

// POST adatok fogadása
$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['id']) && isset($data['status'])) {
    // Adatok tisztítása
    $id = $conn->real_escape_string($data['id']);
    $status = $conn->real_escape_string($data['status']);
    
    // SQL lekérdezés előkészítése
    $sql = "UPDATE applications SET organizer_approval = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $status, $id);
    
    // Lekérdezés végrehajtása és válasz küldése
    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "Státusz sikeresen frissítve",
            "status" => $status,
            "id" => $id
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Hiba történt a státusz frissítése során: " . $stmt->error
        ]);
    }
    
    $stmt->close();
} else {
    echo json_encode([
        "success" => false,
        "message" => "Hiányzó adatok (id vagy status)"
    ]);
}

// Kapcsolat lezárása
$conn->close();
?>