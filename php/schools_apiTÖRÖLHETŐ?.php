<?php
// Adatbázis kapcsolat

include '../db_connection.php';

// Ha POST kérés érkezik
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // SQL lekérdezés az iskolák listázásához
    $sql = "SELECT id, name, approved FROM schools ORDER BY name ASC";
    $result = $conn->query($sql);

    $schools = [];

    // Ha van találat, töltse be az adatokat
    if ($result->num_rows > 0) {
        while ($school = $result->fetch_assoc()) {
            $schools[] = [
                'id' => $school['id'],
                'name' => $school['name'],
                'approved' => $school['approved']
            ];
        }
    }

    // JSON válasz küldése
    header('Content-Type: application/json');
    echo json_encode($schools);

    $conn->close();
} else {
    // Ha nem POST kérést kapunk, akkor 405-ös hibát küldünk
    http_response_code(405);
    echo json_encode(["error" => "Csak POST kérés engedélyezett."]);
}
?>
