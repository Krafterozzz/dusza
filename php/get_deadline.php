<?php
// Include database connection
include '../db_connection.php';

// Fetch the current registration deadline
$query = "SELECT * FROM registration_deadline ORDER BY id DESC LIMIT 1";
$result = $conn->query($query);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo json_encode(["deadline" => $row['deadline']]);
} else {
    echo json_encode(["deadline" => null]);
}

$conn->close();
?>
