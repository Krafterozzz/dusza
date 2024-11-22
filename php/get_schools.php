<?php
header('Content-Type: application/json');

include '../db_connection.php';



if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Kapcsolódási hiba: " . $conn->connect_error]);
    exit;
}

$conn->set_charset("utf8mb4");

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Use the ORDER BY clause as requested
    $sql = "SELECT * FROM `applications` ORDER BY `applications`.`organizer_approval` ASC";
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        $applications = [];
        while($row = $result->fetch_assoc()) {
            $applications[] = [
                'id' => $row['id'],
                'team_name' => $row['team_name'],
                'school_name' => $row['school_name'],
                'team_member1_name' => $row['team_member1_name'],
                'team_member1_grade' => $row['team_member1_grade'],
                'team_member2_name' => $row['team_member2_name'],
                'team_member2_grade' => $row['team_member2_grade'],
                'team_member3_name' => $row['team_member3_name'],
                'team_member3_grade' => $row['team_member3_grade'],
                'substitute_member_name' => $row['substitute_member_name'],
                'substitute_member_grade' => $row['substitute_member_grade'],
                'teacher' => $row['teacher'],
                'category' => $row['category'],
                'programming_language' => $row['programming_language'],
                'status' => $row['organizer_approval']
            ];
        }
        echo json_encode(['success' => true, 'data' => $applications]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Nincsenek adatok.']);
    }
}

$conn->close();
?>