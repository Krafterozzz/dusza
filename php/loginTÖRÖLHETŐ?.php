<?php
session_start();
if (isset($_SESSION['user_id'])) {
    header("Location: ../php/admin_profile.php");
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Kapcsolódás az adatbázishoz
    $conn = new mysqli('localhost', 'db_user', 'db_password', 'database_name');

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Ellenőrizzük a felhasználót
    $stmt = $conn->prepare("SELECT id FROM users WHERE username = ? AND password = ?");
    $stmt->bind_param("ss", $username, $password);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        // Sikeres bejelentkezés
        $_SESSION['user_id'] = $username; // vagy az id-t is tárolhatod
        header("Location: ../php/admin_profile.php");
        exit();
    } else {
        echo "Hibás felhasználónév vagy jelszó.";
    }

    $stmt->close();
    $conn->close();
}
?>

<form method="POST" action="">
    Felhasználónév: <input type="text" name="username" required>
    Jelszó: <input type="password" name="password" required>
    <input type="submit" value="Bejelentkezés">
</form>