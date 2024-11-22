<?php
// update_language.php
header('Content-Type: application/json');

include '../db_connection.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id']) || !isset($data['name']) || empty(trim($data['name']))) {
    echo json_encode([
        "success" => false,
        "message" => "Hiányzó vagy érvénytelen adatok!"
    ]);
    exit;
}



if ($conn->connect_error) {
    echo json_encode([
        "success" => false,
        "message" => "Kapcsolódási hiba: " . $conn->connect_error
    ]);
    exit;
}

$conn->set_charset("utf8mb4");

$id = (int)$data['id'];
$name = trim($data['name']);

// Ellenőrizzük, hogy létezik-e már ilyen nevű programnyelv
$check_sql = "SELECT id FROM programming_languages WHERE name = ? AND id != ?";
$check_stmt = $conn->prepare($check_sql);
$check_stmt->bind_param("si", $name, $id);
$check_stmt->execute();
$check_result = $check_stmt->get_result();

if ($check_result->num_rows > 0) {
    echo json_encode([
        "success" => false,
        "message" => "Már létezik ilyen nevű programnyelv!"
    ]);
    $check_stmt->close();
    $conn->close();
    exit;
}
$check_stmt->close();

// Programnyelv frissítése
$sql = "UPDATE programming_languages SET name = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("si", $name, $id);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Programnyelv sikeresen módosítva!"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Hiba történt a programnyelv módosítása során: " . $stmt->error
    ]);
}

$stmt->close();
$conn->close();
?>