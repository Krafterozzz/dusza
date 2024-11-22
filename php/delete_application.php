<?php
header('Content-Type: application/json');

// Adatbázis kapcsolat adatai
include '../db_connection.php';
// Adatbázis kapcsolat létrehozása


// Hiba ellenőrzés
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Kapcsolódási hiba: " . $conn->connect_error]);
    exit;
}

$conn->set_charset("utf8mb4");

// POST kérés tartalmának beolvasása
$data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($data['id'])) {
    $id = $conn->real_escape_string($data['id']);
    
    // SQL törlés végrehajtása
    $sql = "DELETE FROM applications WHERE id = '$id'";
    
    if ($conn->query($sql) === TRUE) {
        if ($conn->affected_rows > 0) {
            echo json_encode(["success" => true, "message" => "Sikeres törlés"]);
        } else {
            echo json_encode(["success" => false, "message" => "Nem található ilyen azonosítójú jelentkezés"]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Hiba történt a törlés során: " . $conn->error]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Érvénytelen kérés"]);
}

$conn->close();
?>