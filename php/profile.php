<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "Nincs bejelentkezett felhasználó!"]);
    exit;
}

include '../db_connection.php';



if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Kapcsolódási hiba: " . $conn->connect_error]);
    exit;
}

$conn->set_charset("utf8mb4");

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $user_id = $_SESSION['user_id'];
    $sql = "SELECT * FROM applications WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $userData = $result->fetch_assoc();
        echo json_encode(["success" => true, "data" => $userData]);
    } else {
        echo json_encode(["success" => false, "message" => "Felhasználó nem található!"]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $user_id = $_SESSION['user_id'];
    $team_name = $_POST['team_name'];
    $school_name = $_POST['school_name'];
    $team_member1_name = $_POST['team_member1_name'];
    $team_member1_grade = $_POST['team_member1_grade'];
    $team_member2_name = $_POST['team_member2_name'];
    $team_member2_grade = $_POST['team_member2_grade'];
    $team_member3_name = $_POST['team_member3_name'];
    $team_member3_grade = $_POST['team_member3_grade'];
    $substitute_member_name = $_POST['substitute_member_name'];
    $substitute_member_grade = $_POST['substitute_member_grade'];
    $teacher = $_POST['teacher'];
    $category = $_POST['category'];
    $programming_language = $_POST['programming_language'];

    $sql = "UPDATE applications SET 
            team_name = ?, school_name = ?, 
            team_member1_name = ?, team_member1_grade = ?,
            team_member2_name = ?, team_member2_grade = ?,
            team_member3_name = ?, team_member3_grade = ?,
            substitute_member_name = ?, substitute_member_grade = ?,
            teacher = ?, category = ?, programming_language = ?
            WHERE id = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssisisississi", 
        $team_name, $school_name,
        $team_member1_name, $team_member1_grade,
        $team_member2_name, $team_member2_grade,
        $team_member3_name, $team_member3_grade,
        $substitute_member_name, $substitute_member_grade,
        $teacher, $category, $programming_language,
        $user_id
    );

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Adatok sikeresen frissítve!"]);
    } else {
        echo json_encode(["success" => false, "message" => "Hiba történt a frissítés során: " . $stmt->error]);
    }
}

$conn->close();
?>