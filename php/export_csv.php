<?php
header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="csapatok_export.csv"');

include '../db_connection.php';

if ($conn->connect_error) {
    die("Kapcsolódási hiba: " . $conn->connect_error);
}

$conn->set_charset("utf8mb4");

$sql = "SELECT * FROM `applications` ORDER BY `applications`.`organizer_approval` ASC";
$result = $conn->query($sql);

// Create output stream
$output = fopen('php://output', 'w');

// Add UTF-8 BOM for proper Hungarian character encoding in Excel
fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF));

// Fejléc létrehozása külön oszlopokkal és magyarázatokkal
$headers = [
    'Csapat azonosítója',
    'Csapat neve',
    'Iskola neve',
    '1. csapattag neve',
    '1. csapattag osztálya',
    '2. csapattag neve',
    '2. csapattag osztálya',
    '3. csapattag neve',
    '3. csapattag osztálya',
    'Póttag neve',
    'Póttag osztálya',
    'Felkészítő tanár neve',
    'Kategória',
    'Programozási nyelv',
    'Jelentkezés státusza'
];

// Write headers
fputcsv($output, $headers);

// Üres sor a jobb olvashatóságért
fputcsv($output, array_fill(0, count($headers), ''));

// Write data rows
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        // Státusz magyar fordítása
        $status = match($row['organizer_approval']) {
            'approved' => 'Elfogadva',
            'rejected' => 'Visszautasítva',
            default => 'Függőben'
        };
        
        // Adatok rendezett formában
        $data = [
            $row['id'],                        // Csapat azonosítója
            $row['team_name'],                 // Csapat neve
            $row['school_name'],               // Iskola neve
            $row['team_member1_name'],         // 1. csapattag neve
            $row['team_member1_grade'],        // 1. csapattag osztálya
            $row['team_member2_name'],         // 2. csapattag neve
            $row['team_member2_grade'],        // 2. csapattag osztálya
            $row['team_member3_name'],         // 3. csapattag neve
            $row['team_member3_grade'],        // 3. csapattag osztálya
            $row['substitute_member_name'],     // Póttag neve
            $row['substitute_member_grade'],    // Póttag osztálya
            $row['teacher'],                   // Felkészítő tanár neve
            $row['category'],                  // Kategória
            $row['programming_language'],       // Programozási nyelv
            $status                            // Jelentkezés státusza
        ];
        
        fputcsv($output, $data);
        
        // Üres sor minden csapat után a jobb olvashatóságért
        fputcsv($output, array_fill(0, count($headers), ''));
    }
}

$conn->close();
fclose($output);
?>