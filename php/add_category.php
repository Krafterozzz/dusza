<?php
header('Content-Type: application/json');

// Adatbázis kapcsolat adatai
include '../db_connection.php';


// JSON adat beolvasása
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['name']) || empty(trim($data['name']))) {
    echo json_encode([
        "success" => false,
        "message" => "A kategória neve nem lehet üres!"
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

// Kategória nevének tisztítása és előkészítése
$name = trim($data['name']);

// Ellenőrizzük, hogy létezik-e már ilyen nevű kategória
$check_sql = "SELECT id FROM categories WHERE name = ?";
$check_stmt = $conn->prepare($check_sql);
$check_stmt->bind_param("s", $name);
$check_stmt->execute();
$check_result = $check_stmt->get_result();

if ($check_result->num_rows > 0) {
    echo json_encode([
        "success" => false,
        "message" => "Már létezik ilyen nevű kategória!"
    ]);
    $check_stmt->close();
    $conn->close();
    exit;
}
$check_stmt->close();

// Új kategória beszúrása
$sql = "INSERT INTO categories (name) VALUES (?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $name);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Kategória sikeresen hozzáadva!"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Hiba történt a kategória hozzáadása során: " . $stmt->error
    ]);
}

