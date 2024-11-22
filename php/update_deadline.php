<?php
// Include database connection
include '../db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the new deadline from the request
    $deadline = $_POST['deadline'];

    // Update the registration deadline
    $query = "INSERT INTO registration_deadline (deadline) VALUES ('$deadline')";
    if ($conn->query($query) === TRUE) {
        echo "Deadline updated successfully";
    } else {
        echo "Error: " . $conn->error;
    }

    $conn->close();
}
?>
