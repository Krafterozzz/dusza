<?php
session_start();

include '../db_connection.php';





if ($conn->connect_error) {
    die("Kapcsolódási hiba: " . $conn->connect_error);
}

$conn->set_charset("utf8mb4");

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $sql = "SELECT * FROM applications WHERE username = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        if (password_verify($password, $row['password'])) {
            $_SESSION['user_id'] = $row['id'];
            $_SESSION['team_name'] = $row['team_name'];
            $_SESSION['is_logged_in'] = true;
            
            // Sikeres bejelentkezés esetén JavaScript átirányítás
            echo "<script>
                localStorage.setItem('is_logged_in3', 'true');
                window.location.href = '../html/versenyzo_profile.html';
            </script>";
            exit();
        } else {
            // Hibás jelszó esetén átirányítás
            header("Location: ../html/failedloginjelszo.html");
            exit();
        }
    } else {
        // Hibás felhasználónév esetén átirányítás
        header("Location: ../html/failedloginfelhasznalo.html");
        exit();
    }

    $stmt->close();
}
$conn->close();
?>