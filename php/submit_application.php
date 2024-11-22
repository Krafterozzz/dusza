<?php
function submitApplication($formData) {
    
    include '../db_connection.php';


    header('Content-Type: application/json');

    

    if ($conn->connect_error) {
        return ["success" => false, "message" => "Kapcsolódási hiba: " . $conn->connect_error];
    }

    $hashedPassword = password_hash($formData['password'], PASSWORD_DEFAULT);

    // Alapértelmezett értékek beállítása a pót tagokhoz, ha üresek
    $substituteMemberName = empty($formData['substitute_member_name']) ? NULL : $formData['substitute_member_name'];
    $substituteMemberGrade = empty($formData['substitute_member_grade']) ? NULL : $formData['substitute_member_grade'];

    $sql = "INSERT INTO applications (username, password, team_name, school_name, 
        team_member1_name, team_member1_grade, team_member2_name, team_member2_grade, 
        team_member3_name, team_member3_grade, substitute_member_name, substitute_member_grade, 
        teacher, category, programming_language)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssssssssssssss", 
        $formData['username'], $hashedPassword, $formData['team_name'], $formData['school_name'], 
        $formData['team_member1_name'], $formData['team_member1_grade'], 
        $formData['team_member2_name'], $formData['team_member2_grade'], 
        $formData['team_member3_name'], $formData['team_member3_grade'], 
        $substituteMemberName, $substituteMemberGrade, 
        $formData['teacher'], $formData['category'], $formData['programming_language']
    );

    if ($stmt->execute()) {
        // Sikeres jelentkezés esetén átirányítás a success.html oldalra
        header("Location: ../html/success.html");
        exit; // Fontos az exit() meghívása az átirányítás után
    } else {
        $result = ["success" => false, "message" => "Hiba történt: " . $stmt->error];
    }

    $stmt->close();
    $conn->close();

    return $result;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $result = submitApplication($_POST);
    
    // Ha a jelentkezés sikertelen volt, visszaadunk egy JSON választ
    if (!$result['success']) {
        echo json_encode($result);
    }
}

?>